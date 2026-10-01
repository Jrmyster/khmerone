"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "khmerone-background-audio";
const TARGET_VOLUME = 0.2;
const FADE_SECONDS = 1.5;
const labels = {
  en: {
    play: "Play Ambient Music",
    pause: "Mute",
    resume: "Resume ambient music",
    loading: "Cancel music loading",
    error: "Music could not start. Tap the music button to try again.",
  },
  km: {
    play: "បើកតន្ត្រីផ្ទៃខាងក្រោយ",
    pause: "បិទសំឡេង",
    resume: "បន្តតន្ត្រីផ្ទៃខាងក្រោយ",
    loading: "បោះបង់ការផ្ទុកតន្ត្រី",
    error:
      "មិនអាចចាប់ផ្ដើមតន្ត្រីបានទេ។ សូមចុចប៊ូតុងតន្ត្រីដើម្បីសាកល្បងម្ដងទៀត។",
  },
};

/** Keep mounted in the root layout; route content never owns the audio element. */
export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const fadeRef = useRef<number | null>(null);
  const operationRef = useRef(0);
  const wantsPlayback = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferredPlaying, setPreferredPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [locale, setLocale] = useState<"en" | "km">("en");
  const [controlHost, setControlHost] = useState<HTMLElement | null>(null);

  // Only the control moves into the header. The audio element stays in the layout.
  useEffect(() => {
    let host: HTMLElement | null = null;
    const syncHost = () => {
      if (host?.isConnected) return;
      const nextHost = document.getElementById("background-audio-controls");
      if (nextHost !== host) {
        host = nextHost;
        setControlHost(nextHost);
      }
    };
    syncHost();
    const observer = new MutationObserver(syncHost);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  function cancelFade() {
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    fadeRef.current = null;
    const context = contextRef.current;
    const gain = gainRef.current;
    if (context && gain) {
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(0, context.currentTime);
    }
  }

  function remember(value: boolean) {
    setPreferredPlaying(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "unmuted" : "muted");
    } catch {
      /* Playback remains usable without browser storage. */
    }
  }

  function pause() {
    wantsPlayback.current = false;
    operationRef.current += 1;
    cancelFade();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.muted = true;
      audio.volume = 0;
    }
    setPlaying(false);
    setLoading(false);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = true;
      audio.volume = 0;
    }
    try {
      setPreferredPlaying(localStorage.getItem(STORAGE_KEY) === "unmuted");
    } catch {
      /* Default to paused. */
    }
    // Home owns the language switch; the persistent player observes its locale.
    const updateLocale = () =>
      setLocale(document.documentElement.lang === "km" ? "km" : "en");
    updateLocale();
    const observer = new MutationObserver(updateLocale);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    return () => {
      observer.disconnect();
      wantsPlayback.current = false;
      operationRef.current += 1;
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
      audio?.pause();
      const context = contextRef.current;
      contextRef.current = null;
      gainRef.current = null;
      if (context && context.state !== "closed")
        void context.close().catch(() => {});
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    setError(false);
    if (wantsPlayback.current) {
      pause();
      remember(false);
      return;
    }

    wantsPlayback.current = true;
    const operation = ++operationRef.current;
    setLoading(true);
    cancelFade();
    try {
      // A gain node supports the 20% fade on iOS, where media.volume may be fixed.
      // Both context.resume() and audio.play() are invoked in this click handler.
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!contextRef.current && AudioContextClass) {
        const context = new AudioContextClass();
        contextRef.current = context;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, context.currentTime);
        const source = context.createMediaElementSource(audio);
        source.connect(gain);
        gain.connect(context.destination);
        gainRef.current = gain;
      }
      const context = contextRef.current;
      audio.volume = gainRef.current ? 1 : 0;
      audio.muted = false;
      await Promise.all([context?.resume(), audio.play()]);
      if (operation !== operationRef.current || !wantsPlayback.current) return;
      if (context && context.state !== "running")
        throw new Error("Audio context is suspended");
      setLoading(false);
      setPlaying(true);
      remember(true);
      const gain = gainRef.current;
      if (context && gain) {
        const now = context.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(TARGET_VOLUME, now + FADE_SECONDS);
      } else {
        const start = performance.now();
        const fade = (now: number) => {
          if (operation !== operationRef.current || !wantsPlayback.current)
            return;
          const fraction = Math.min(1, (now - start) / (FADE_SECONDS * 1000));
          audio.volume = TARGET_VOLUME * fraction;
          fadeRef.current = fraction < 1 ? requestAnimationFrame(fade) : null;
        };
        fadeRef.current = requestAnimationFrame(fade);
      }
    } catch {
      if (operation !== operationRef.current) return;
      pause();
      setError(true);
    }
  }

  const t = labels[locale];
  const label = loading
    ? t.loading
    : playing
      ? t.pause
      : preferredPlaying
        ? t.resume
        : t.play;
  const controls = (
    <div className={`background-audio ${controlHost ? "is-header" : "is-fallback"}`}>
      <button
        type="button"
        className={`background-audio-button ${playing ? "is-playing" : ""}`}
        onClick={() => void toggle()}
        aria-label={label}
        title={label}
        aria-pressed={playing}
        aria-busy={loading}
        aria-describedby={error ? "background-audio-error" : undefined}
      >
        {loading ? (
          <LoaderCircle
            className="background-audio-loading"
            size={21}
            aria-hidden="true"
          />
        ) : playing ? (
          <Volume2 size={21} aria-hidden="true" />
        ) : (
          <VolumeX size={21} aria-hidden="true" />
        )}
      </button>
      {error && (
        <p
          className="background-audio-error"
          id="background-audio-error"
          role="status"
        >
          {t.error}
        </p>
      )}
    </div>
  );
  return <>
    <audio
      ref={audioRef}
      src="/audio/buddhist-harmony.mp3"
      loop={true}
      preload="none"
      muted={!playing && !loading}
      hidden
      onPause={() => {
        if (audioRef.current?.paused && wantsPlayback.current) pause();
      }}
      onError={() => {
        if (wantsPlayback.current) {
          pause();
          setError(true);
        }
      }}
    />
    {controlHost ? createPortal(controls, controlHost) : controls}
  </>;
}
