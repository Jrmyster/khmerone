// NiiVue 0.69.0 names and enum values, checked against nvdocument.ts.
// Keep educational orientation and privacy settings explicit and unit-testable.
export function viewerOptions() {
  return {
    isRadiologicalConvention: false,
    dragAndDropEnabled: false,
    drawingEnabled: false,
    isColorbar: false,
    show3Dcrosshair: true,
    crosshairWidth: 1,
    crosshairColor: [0.65, 0.92, 0.84, 1],
    backColor: [0.02, 0.04, 0.07, 1],
    fontColor: [1, 0.8, 0.4, 1],
    textHeight: -1,
    fontMinPx: 18,
    isOrientationTextVisible: true,
    showAllOrientationMarkers: true,
    multiplanarLayout: 2,
    multiplanarShowRender: 1,
    multiplanarEqualSize: true,
    isOrientCube: true,
  };
}
