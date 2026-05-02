import React from 'react';

const AnimatedBackground = () => (
  <>
    <style>{`
      .anim-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        background: #080a0b;
      }

      /* Aurora wave layers */
      .aurora {
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        opacity: 0.18;
        animation: auroraRotate 20s linear infinite;
        background: conic-gradient(
          from 0deg at 50% 50%,
          #2e5bff 0deg,
          #571bc1 60deg,
          #080a0b 120deg,
          #2e5bff 180deg,
          #571bc1 240deg,
          #080a0b 300deg,
          #2e5bff 360deg
        );
        filter: blur(60px);
      }

      .aurora-2 {
        position: absolute;
        width: 160%;
        height: 160%;
        top: -30%;
        left: -30%;
        opacity: 0.12;
        animation: auroraRotate 30s linear infinite reverse;
        background: conic-gradient(
          from 90deg at 40% 60%,
          #571bc1 0deg,
          #2e5bff 90deg,
          #080a0b 160deg,
          #571bc1 240deg,
          #080a0b 320deg,
          #2e5bff 360deg
        );
        filter: blur(80px);
      }

      @keyframes auroraRotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      /* Floating particles */
      .particle {
        position: absolute;
        border-radius: 50%;
        animation: floatUp linear infinite;
        opacity: 0;
      }

      @keyframes floatUp {
        0%   { transform: translateY(110vh) scale(0); opacity: 0; }
        10%  { opacity: 0.6; }
        90%  { opacity: 0.4; }
        100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
      }

      /* Scanline overlay */
      .scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 3px,
          rgba(0,0,0,0.08) 3px,
          rgba(0,0,0,0.08) 4px
        );
        pointer-events: none;
      }

      /* Subtle vignette */
      .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center,
          transparent 40%,
          rgba(0,0,0,0.6) 100%
        );
        pointer-events: none;
      }
    `}</style>

    <div className="anim-bg">
      {/* Aurora layers */}
      <div className="aurora" />
      <div className="aurora-2" />

      {/* Floating particles */}
      {[...Array(18)].map((_, i) => {
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * 15;
        const color = i % 3 === 0 ? '#2e5bff' : i % 3 === 1 ? '#571bc1' : '#b8c3ff';
        return (
          <div
            key={i}
            className="particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              backgroundColor: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      {/* Overlays */}
      <div className="scanlines" />
      <div className="vignette" />
    </div>
  </>
);

export default AnimatedBackground;
