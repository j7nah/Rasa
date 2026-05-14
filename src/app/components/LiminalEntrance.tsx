import { useState, useEffect } from 'react';

const SESSION_KEY = 'rasa_entered';

// phase sequence: idle → punch → shockwave → fade
type Phase = 'idle' | 'punch' | 'shockwave' | 'fade';

export function LiminalEntrance() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY));
  const [phase, setPhase] = useState<Phase>('idle');

  const enter = () => {
    if (phase !== 'idle') return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('punch');
    setTimeout(() => setPhase('shockwave'), 60);
    setTimeout(() => setPhase('fade'), 320);
    setTimeout(() => setVisible(false), 320 + 1000);
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, phase]);

  if (!visible) return null;

  return (
    <div
      onClick={enter}
      className="fixed inset-0 z-50 cursor-default select-none overflow-hidden"
      style={{
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        background: 'rgba(242, 244, 246, 0.72)',
        opacity: phase === 'fade' ? 0 : 1,
        // Punch: quick compress on hit, then the shockwave carries forward
        transform:
          phase === 'punch'
            ? 'scale(0.97)'
            : phase === 'shockwave'
            ? 'scale(1.06)'
            : phase === 'fade'
            ? 'scale(1.12)'
            : 'scale(1)',
        transformOrigin: 'center center',
        transition:
          phase === 'punch'
            ? 'transform 60ms cubic-bezier(0.3, 0, 0.6, 1)'
            : phase === 'shockwave'
            ? 'transform 260ms cubic-bezier(0.2, 0, 0.3, 1)'
            : phase === 'fade'
            ? 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), transform 1000ms cubic-bezier(0.2, 0, 0.2, 1)'
            : undefined,
      }}
    >
      {/* Top glow ellipse */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-8%',
          left: '5%',
          right: '5%',
          height: '38%',
          background:
            'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(220,228,238,0.9) 0%, rgba(210,220,232,0.5) 45%, transparent 75%)',
          opacity: phase === 'idle' ? 1 : 0,
          transition: 'opacity 150ms ease-out',
        }}
      />

      {/* Bottom glow ellipse */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-8%',
          left: '5%',
          right: '5%',
          height: '38%',
          background:
            'radial-gradient(ellipse 70% 55% at 50% 70%, rgba(220,228,238,0.9) 0%, rgba(210,220,232,0.5) 45%, transparent 75%)',
          opacity: phase === 'idle' ? 1 : 0,
          transition: 'opacity 150ms ease-out',
        }}
      />

      {/* White fill that blooms in behind the shockwave rings */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: '#ffffff',
          opacity:
            phase === 'punch'
              ? 0.6
              : phase === 'shockwave'
              ? 0.75
              : phase === 'fade'
              ? 0.9
              : 0,
          transition:
            phase === 'punch'
              ? 'opacity 60ms ease-in'
              : phase === 'shockwave'
              ? 'opacity 260ms ease-out'
              : phase === 'fade'
              ? 'opacity 600ms ease-in'
              : undefined,
        }}
      />

      {/* Primary shockwave ring — fast, soft gradient pulse */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '50%',
          left: '50%',
          width: '120px',
          height: '120px',
          marginTop: '-60px',
          marginLeft: '-60px',
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(175, 192, 208, 0.7) 55%, rgba(185, 200, 215, 0.25) 72%, transparent 90%)',
          transform:
            phase === 'shockwave' || phase === 'fade' ? 'scale(28)' : 'scale(0)',
          opacity: phase === 'shockwave' ? 1 : 0,
          transition:
            phase === 'shockwave'
              ? 'transform 350ms cubic-bezier(0.1, 0, 0.3, 1), opacity 350ms ease-out'
              : phase === 'punch'
              ? 'none'
              : 'opacity 100ms ease-out',
        }}
      />

      {/* Secondary shockwave ring — delayed, wider and softer */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '50%',
          left: '50%',
          width: '160px',
          height: '160px',
          marginTop: '-80px',
          marginLeft: '-80px',
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(190, 205, 218, 0.45) 57%, rgba(200, 214, 226, 0.15) 75%, transparent 92%)',
          transform:
            phase === 'shockwave' || phase === 'fade' ? 'scale(22)' : 'scale(0)',
          opacity: phase === 'shockwave' ? 0.8 : 0,
          transition:
            phase === 'shockwave'
              ? 'transform 480ms cubic-bezier(0.1, 0, 0.4, 1) 55ms, opacity 480ms ease-out 55ms'
              : phase === 'punch'
              ? 'none'
              : 'opacity 100ms ease-out',
        }}
      />

      {/* Prompt text — centered, Jura font */}
      <p
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Jura', sans-serif",
          fontWeight: 400,
          fontSize: '26px',
          lineHeight: 'normal',
          color: '#909090',
          opacity: phase === 'idle' ? 1 : 0,
          transition: 'opacity 80ms ease-out',
          margin: 0,
          whiteSpace: 'nowrap',
        }}
      >
        press space to enter
      </p>
    </div>
  );
}
