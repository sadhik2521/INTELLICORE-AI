import React, { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        .anim-bg-container {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          background: #050608;
          perspective: 1000px;
        }

        /* Deep Nebula Clouds */
        .nebula {
          position: absolute;
          width: 150%;
          height: 150%;
          top: -25%;
          left: -25%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(46, 91, 255, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(87, 27, 193, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(20, 20, 30, 1) 0%, transparent 100%);
          filter: blur(100px);
          animation: nebulaShift 30s ease-in-out infinite alternate;
        }

        @keyframes nebulaShift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-5%, -5%) scale(1.1); }
        }

        /* Animated Digital Grid */
        .grid-plane {
          position: absolute;
          width: 200%;
          height: 200%;
          bottom: -50%;
          left: -50%;
          background-image: 
            linear-gradient(rgba(46, 91, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 91, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: rotateX(60deg);
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 500px; }
        }

        /* Energy Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
          mix-blend-mode: screen;
        }

        .orb-blue {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #2e5bff 0%, transparent 70%);
          top: 10%; left: 10%;
          animation: floatOrb1 15s ease-in-out infinite alternate;
        }

        .orb-purple {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #571bc1 0%, transparent 70%);
          bottom: 10%; right: 10%;
          animation: floatOrb2 18s ease-in-out infinite alternate;
        }

        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(100px, 50px) scale(1.2); }
        }

        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-100px, -50px) scale(0.8); }
        }

        /* Interactive Mouse Glow */
        .mouse-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(46, 91, 255, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          transition: transform 0.1s ease-out;
          filter: blur(40px);
        }

        /* Scanning Line */
        .scanner {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(46, 91, 255, 0.2), transparent);
          top: 0;
          animation: scan 8s linear infinite;
          opacity: 0.3;
        }

        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>

      <div className="anim-bg-container">
        <div className="nebula" />
        <div className="grid-plane" />
        <div className="orb orb-blue" />
        <div className="orb orb-purple" />
        <div 
          className="mouse-glow" 
          style={{ 
            transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
            left: '50%',
            top: '50%'
          }} 
        />
        <div className="scanner" />
        
        {/* Subtle noise texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
          opacity: 0.05, pointerEvents: 'none', mixBlendMode: 'overlay'
        }} />
      </div>
    </>
  );
};

export default AnimatedBackground;
