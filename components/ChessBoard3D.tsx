"use client";

import { useEffect, useRef } from "react";
import type { Chess, Square } from "chess.js";
import type * as THREE from "three";

interface Props {
  game: Chess;
  selected: Square | null;
  destinations: Square[];
  lastMove: { from: Square; to: Square } | null;
  flipped: boolean;
  viewKey: number;
  onSquare: (square: Square) => void;
  onUnavailable: () => void;
  label: string;
}

/** Rendering has no authority over moves: both boards use the same chess.js state. */
export function ChessBoard3D(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  const redraw = useRef<(() => void) | null>(null);
  useEffect(() => { latest.current = props; redraw.current?.(); }, [props]);

  useEffect(() => {
    let disposed = false;
    let release: (() => void) | undefined;
    const mount = host.current;
    if (!mount) return;
    void Promise.all([import("three"), import("three/addons/controls/OrbitControls.js")]).then(([T, { OrbitControls }]) => {
      if (disposed) return;
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(36, 1, 0.1, 80);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.minDistance = 10;
      controls.maxDistance = 22;
      controls.minPolarAngle = 0.25;
      controls.maxPolarAngle = Math.PI / 2.5;
      controls.target.set(0, 0.1, 0);
      scene.add(new T.HemisphereLight(0xc5f9ff, 0x172a47, 3));
      const sun = new T.DirectionalLight(0xffedcf, 4.5);
      sun.position.set(-4, 12, 5); sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
      sun.shadow.bias = -0.001;
      scene.add(sun);
      const rim = new T.DirectionalLight(0x45dce4, 3); rim.position.set(5, 6, -5); scene.add(rim);
      const board = new T.Group(); scene.add(board);
      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [];
      const mat = (color: number, metalness = 0.1, roughness = 0.45) => {
        const material = new T.MeshStandardMaterial({ color, metalness, roughness }); materials.push(material); return material;
      };
      const dark = mat(0x12636a), light = mat(0xe1e5cd), edge = mat(0x10283d, 0.45);
      const white = mat(0xfff1cf, 0.18, 0.3), black = mat(0x13293f, 0.5, 0.28), gold = mat(0xd9b86e, 0.65);
      const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number) => {
        geometries.push(geometry); const object = new T.Mesh(geometry, material);
        object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
      };
      mesh(new T.BoxGeometry(8.6, 0.28, 8.6), edge, board, 0, -0.2, 0);
      const squares: THREE.Mesh[] = [];
      const point = (square: string) => new T.Vector3(square.charCodeAt(0) - 97 - 3.5, 0.04, 8 - Number(square[1]) - 3.5);
      for (let rank = 1; rank <= 8; rank++) for (let file = 0; file < 8; file++) {
        const square = `${String.fromCharCode(97 + file)}${rank}` as Square;
        const pos = point(square);
        const tile = mesh(new T.BoxGeometry(0.99, 0.07, 0.99), (file + rank) % 2 ? dark : light, board, pos.x, 0, pos.z);
        tile.userData.square = square; squares.push(tile);
      }
      const pieces = new T.Group(); scene.add(pieces);
      const markers = new T.Group(); scene.add(markers);
      const pieceGeometries: THREE.BufferGeometry[] = [];
      const markerGeometries: THREE.BufferGeometry[] = [];
      const selectedMat = new T.MeshBasicMaterial({ color: 0xffd17a, transparent: true, opacity: 0.8, depthWrite: false });
      const moveMat = new T.MeshBasicMaterial({ color: 0x72ffcc, transparent: true, opacity: 0.85, depthWrite: false });
      const previousMat = new T.MeshBasicMaterial({ color: 0x8bd6ff, transparent: true, opacity: 0.4, depthWrite: false });
      materials.push(selectedMat, moveMat, previousMat);
      let needsRender = true;
      let oldFen = "";
      let oldFlipped: boolean | undefined;
      let oldKey = -1;
      let moving: THREE.Group | null = null;
      let destination: THREE.Vector3 | null = null;
      let start: THREE.Vector3 | null = null;
      let moveStarted = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      function makePiece(type: string, color: string, square: Square) {
        const group = new T.Group();
        group.userData.square = square;
        const body = color === "w" ? white : black;
        function part(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
          const m = new T.Mesh(geometry, material); pieceGeometries.push(geometry); m.position.set(x, y, z); m.castShadow = true; group.add(m); return m;
        }
        const height = { p: 0.72, r: 0.94, n: 1.05, b: 1.1, q: 1.28, k: 1.4 }[type] ?? 1;
        const profile = [[0, 0], [.31, 0], [.32, .07], [.26, .13], [.23, .18], [.16, height * .43], [.14, height * .62], [.23, height * .66], [.22, height * .73], [.13, height * .77], [0, height * .78]];
        part(new T.LatheGeometry(profile.map(([x, y]) => new T.Vector2(x, y)), 24), body, 0, 0.07, 0);
        part(new T.TorusGeometry(.264, .018, 6, 24), gold, 0, .19, 0).rotation.x = Math.PI / 2;
        if (type === "p") part(new T.SphereGeometry(.19, 20, 12), body, 0, height * .88, 0);
        if (type === "b") {
          part(new T.SphereGeometry(.18, 20, 14), body, 0, height * .86, 0).scale.y = 1.4;
          part(new T.SphereGeometry(.055, 12, 8), gold, 0, height * 1.13, 0);
        }
        if (type === "r") {
          part(new T.CylinderGeometry(.26, .22, .17, 24), body, 0, height * .85, 0);
          for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; part(new T.BoxGeometry(.13, .14, .14), body, Math.cos(a) * .19, height * 1.01, Math.sin(a) * .19); }
        }
        if (type === "q") {
          part(new T.CylinderGeometry(.24, .13, .18, 20), body, 0, height * .84, 0);
          for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; part(new T.SphereGeometry(.055, 10, 8), gold, Math.cos(a) * .19, height, Math.sin(a) * .19); }
          part(new T.SphereGeometry(.08, 14, 10), body, 0, height * 1.04, 0);
        }
        if (type === "k") {
          part(new T.SphereGeometry(.15, 16, 12), body, 0, height * .84, 0);
          part(new T.BoxGeometry(.075, .32, .075), gold, 0, height * 1.04, 0);
          part(new T.BoxGeometry(.25, .075, .075), gold, 0, height * 1.08, 0);
        }
        if (type === "n") {
          const shape = new T.Shape(); shape.moveTo(-.2, 0); shape.lineTo(.2, 0); shape.lineTo(.17, .28); shape.lineTo(.3, .39); shape.lineTo(.25, .56); shape.lineTo(.04, .63); shape.lineTo(0, .8); shape.lineTo(-.12, .7); shape.lineTo(-.24, .43); shape.closePath();
          const head = part(new T.ExtrudeGeometry(shape, { depth: .21, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .025, bevelThickness: .025 }), body, -.1, .52, .1);
          head.rotation.y = Math.PI / 2;
          part(new T.SphereGeometry(.027, 8, 8), gold, .13, 1.07, -.1);
        }
        group.position.copy(point(square)); group.rotation.y = color === "w" ? 0 : Math.PI;
        pieces.add(group); return group;
      }
      function update() {
        const current = latest.current;
        const fen = current.game.fen();
        if (oldFlipped !== current.flipped || oldKey !== current.viewKey) {
          const side = current.flipped ? -1 : 1;
          camera.position.set(5.4 * side, 9.4, 10 * side); controls.target.set(0, .2, 0); controls.update();
          oldFlipped = current.flipped; oldKey = current.viewKey;
        }
        if (oldFen !== fen) {
          pieces.clear(); pieceGeometries.splice(0).forEach((g) => g.dispose()); moving = null;
          for (const row of current.game.board()) for (const piece of row) if (piece) {
            const item = makePiece(piece.type, piece.color, piece.square);
            if (oldFen && current.lastMove?.to === piece.square && !reduced.matches) {
              moving = item; destination = item.position.clone(); start = point(current.lastMove.from); moving.position.copy(start); moveStarted = performance.now();
            }
          }
          oldFen = fen;
        }
        markers.clear(); markerGeometries.splice(0).forEach((g) => g.dispose());
        const marker = (square: Square, geometry: THREE.BufferGeometry, material: THREE.Material) => {
          markerGeometries.push(geometry); const item = new T.Mesh(geometry, material); item.rotation.x = -Math.PI / 2; item.position.copy(point(square)); item.position.y = .052; markers.add(item);
        };
        if (current.lastMove) for (const square of [current.lastMove.from, current.lastMove.to]) marker(square, new T.PlaneGeometry(.94, .94), previousMat);
        if (current.selected) marker(current.selected, new T.RingGeometry(.32, .45, 32), selectedMat);
        for (const square of current.destinations) marker(square, new T.CircleGeometry(.13, 20), moveMat);
        needsRender = true;
      }
      redraw.current = update; update();
      const raycaster = new T.Raycaster(); const pointer = new T.Vector2();
      let down = { x: 0, y: 0 };
      const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY }; };
      const onUp = (e: PointerEvent) => {
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects([...pieces.children, ...squares], true)[0];
        if (hit) {
          let object: THREE.Object3D | null = hit.object;
          while (object && !object.userData.square) object = object.parent;
          if (object) latest.current.onSquare(object.userData.square as Square);
        }
      };
      const lost = (e: Event) => { e.preventDefault(); latest.current.onUnavailable(); };
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointerup", onUp);
      renderer.domElement.addEventListener("webglcontextlost", lost);
      const resized = new ResizeObserver(() => {
        const width = mount.clientWidth, height = mount.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); needsRender = true;
      }); resized.observe(mount);
      let frame = 0;
      function animate() {
        if (disposed) return;
        frame = requestAnimationFrame(animate);
        const changed = controls.update();
        if (moving && start && destination) {
          const progress = Math.min(1, (performance.now() - moveStarted) / 240);
          moving.position.lerpVectors(start, destination, 1 - (1 - progress) ** 3);
          if (progress === 1) moving = null;
          needsRender = true;
        }
        if (!document.hidden && (changed || needsRender)) { renderer.render(scene, camera); needsRender = false; }
      }
      animate();
      release = () => {
        cancelAnimationFrame(frame); redraw.current = null; resized.disconnect(); controls.dispose();
        renderer.domElement.removeEventListener("pointerdown", onDown); renderer.domElement.removeEventListener("pointerup", onUp); renderer.domElement.removeEventListener("webglcontextlost", lost);
        [...geometries, ...pieceGeometries, ...markerGeometries].forEach((g) => g.dispose()); materials.forEach((m) => m.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { if (!disposed) latest.current.onUnavailable(); });
    return () => { disposed = true; release?.(); };
  }, []);

  return <div ref={host} className="chess-three" role="img" aria-label={props.label} />;
}
