/**
 * Lottie Animation Test — Scene-1.json
 *
 * Animation breakdown:
 *  - 640 × 360 canvas · 60 fps · 240 frames (4 s)
 *  - Phase 1 (0 → 0.71 s):  top banner image reveals via shrinking mask + scales 100% → 120%
 *  - Phase 2 (0.33 → 1.37 s): product/logo image appears via expanding box mask + scales 120% → 100%
 */

import Lottie, {type LottieRefCurrentProps} from 'lottie-react';
import {useRef, useState, useCallback, useEffect} from 'react';
// JSON is imported directly so lottie-web can read the embedded base64 images (e:1 assets)
import sceneData from '~/animations/Scene-1.json';

export default function LottieTestPage() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  // lottie-web uses canvas/document APIs — must NOT run during SSR
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const handlePlayPause = useCallback(() => {
    if (!lottieRef.current) return;
    if (isPlaying) {
      lottieRef.current.pause();
    } else {
      lottieRef.current.play();
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const handleRestart = useCallback(() => {
    if (!lottieRef.current) return;
    lottieRef.current.goToAndPlay(0, true);
    setIsPlaying(true);
  }, []);

  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setSpeed(v);
      lottieRef.current?.setSpeed(v);
    },
    [],
  );

  const toggleLoop = useCallback(() => {
    setLoop((l) => !l);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      {/* Title */}
      <div style={{textAlign: 'center', color: '#fff'}}>
        <h1 style={{margin: 0, fontSize: '1.5rem', fontWeight: 700}}>
          Scene-1 · Lottie Animation Test
        </h1>
        <p style={{margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#888'}}>
          640 × 360 · 60 fps · 240 frames · 4 s
        </p>
      </div>

      {/* Animation container */}
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          background: '#fff',
          lineHeight: 0,
          width: 640,
          height: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isMounted ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={sceneData}
            loop={loop}
            autoplay
            renderer="svg"
            style={{width: 640, height: 360}}
            onComplete={() => {
              if (!loop) setIsPlaying(false);
            }}
          />
        ) : (
          <span style={{color: '#aaa', fontSize: '0.85rem'}}>Loading…</span>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '1.2rem 2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Buttons row */}
        <div style={{display: 'flex', gap: '0.75rem'}}>
          <button
            onClick={handlePlayPause}
            style={btnStyle}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={handleRestart} style={btnStyle}>
            ↩ Restart
          </button>
          <button
            onClick={toggleLoop}
            style={{
              ...btnStyle,
              background: loop ? '#6366f1' : '#2a2a2a',
              borderColor: loop ? '#6366f1' : '#444',
            }}
          >
            {loop ? '🔁 Loop ON' : '🔁 Loop OFF'}
          </button>
        </div>

        {/* Speed slider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#ccc',
            fontSize: '0.85rem',
          }}
        >
          <span>Speed</span>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={speed}
            onChange={handleSpeedChange}
            style={{accentColor: '#6366f1', width: 160}}
          />
          <span style={{minWidth: 36, color: '#fff', fontWeight: 600}}>
            {speed}×
          </span>
        </div>

        {/* Animation meta */}
        <div
          style={{
            fontSize: '0.75rem',
            color: '#555',
            display: 'flex',
            gap: '1.5rem',
          }}
        >
          <span>Phase 1 → banner reveal + scale-up (0–0.71 s)</span>
          <span>Phase 2 → image reveal + scale-down (0.33–1.37 s)</span>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1.2rem',
  borderRadius: '8px',
  border: '1px solid #444',
  background: '#2a2a2a',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'background 0.15s',
};
