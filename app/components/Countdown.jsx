'use client';

import { useEffect, useRef, useState } from 'react';

export default function BlackHole() {
  const containerRef = useRef(null);
  const hoverRef = useRef(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!containerRef.current || !hoverRef.current) return;

    const container = containerRef.current;
    const centerHover = hoverRef.current;

    const h = container.offsetHeight;
    const w = container.offsetWidth;
    const cw = w;
    const ch = h;

    const maxorbit = 305;
    const centery = ch / 2;
    const centerx = cw / 2;

    const startTime = Date.now();
    let currentTime = 0;

    const stars = [];
    let collapse = false;
    let expanse = false;
    let returning = false;

    // Create main canvas
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    container.appendChild(canvas);
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'multiply';

    function setDPI(canvas, dpi) {
      if (!canvas.style.width) canvas.style.width = canvas.width + 'px';
      if (!canvas.style.height) canvas.style.height = canvas.height + 'px';
      const scaleFactor = dpi / 96;
      canvas.width = Math.ceil(canvas.width * scaleFactor);
      canvas.height = Math.ceil(canvas.height * scaleFactor);
      const ctx = canvas.getContext('2d');
      ctx.scale(scaleFactor, scaleFactor);
    }

    setDPI(canvas, 192);

    function rotate(cx, cy, x, y, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        cos * (x - cx) + sin * (y - cy) + cx,
        cos * (y - cy) - sin * (x - cx) + cy,
      ];
    }

    class Star {
      constructor() {
        const rands = [
          Math.random() * (maxorbit / 2) + 1,
          Math.random() * (maxorbit / 2) + maxorbit,
        ];
        const orbital = rands.reduce((a, b) => a + b) / rands.length;

        this.x = centerx;
        this.y = centery + orbital;
        this.yOrigin = this.y;
        this.originalY = this.y;
        this.speed = (Math.random() * 2.5 + 1.5) * Math.PI / 180;
        this.startRotation = Math.random() * Math.PI * 2;
        this.rotation = 0;
        this.id = stars.length;

        let collapseBonus = orbital - maxorbit * 0.7;
        if (collapseBonus < 0) collapseBonus = 0;

        this.color = `rgba(255,255,255,1)`;
        this.hoverPos = centery + maxorbit / 2 + collapseBonus;
        this.expansePos = centery + (this.id % 100) * -10 + Math.random() * 20;

        this.prevR = this.startRotation;
        this.prevX = this.x;
        this.prevY = this.y;

        this.size = Math.random() * 4 + 0.5;
        stars.push(this);
      }

      draw() {
        if (!expanse && !returning) {
          this.rotation = this.startRotation + currentTime * this.speed;
          if (!collapse) {
            if (this.y > this.yOrigin) this.y -= 2.5;
            if (this.y < this.yOrigin - 4) this.y += (this.yOrigin - this.y) / 10;
          } else {
            if (this.y > this.hoverPos) this.y -= (this.hoverPos - this.y) / -5;
            if (this.y < this.hoverPos - 4) this.y += 2.5;
          }
        } else if (expanse && !returning) {
          this.rotation = this.startRotation + currentTime * (this.speed / 2);
          if (this.y > this.expansePos) this.y -= (this.expansePos - this.y) / -80;
        } else if (returning) {
          this.rotation = this.startRotation + currentTime * this.speed;
          if (Math.abs(this.y - this.originalY) > 2) this.y += (this.originalY - this.y) / 50;
          else this.y = this.originalY;
        }

        context.save();
        context.strokeStyle = this.color;
        context.lineWidth = this.size;
        context.beginPath();

        const old = rotate(centerx, centery, this.prevX, this.prevY, -this.prevR);
        context.moveTo(old[0], old[1]);

        context.translate(centerx, centery);
        context.rotate(this.rotation);
        context.translate(-centerx, -centery);

        context.lineTo(this.x, this.y);
        context.stroke();
        context.restore();

        this.prevR = this.rotation;
        this.prevX = this.x;
        this.prevY = this.y;
      }
    }

    for (let i = 0; i < 2500; i++) new Star();

    function loop() {
      currentTime = (Date.now() - startTime) / 50;
      context.fillStyle = 'rgba(0,0,0,0.2)';
      context.fillRect(0, 0, cw, ch);
      stars.forEach((s) => s.draw());
      requestAnimationFrame(loop);
    }

    loop();

    // Countdown
    function startCountdown() {
      let counter = 5;
      setCountdown(counter);
      const interval = setInterval(() => {
        counter--;
        setCountdown(counter);
        if (counter < 0) {
          clearInterval(interval);
          triggerExpanse();
        }
      }, 1000);
    }
function triggerExpanse() {
  collapse = false;
  expanse = true;
  returning = false;
  centerHover.style.transition = 'opacity 0.8s ease';
  centerHover.style.opacity = 0;
  centerHover.style.pointerEvents = 'none';


  container.style.transition = 'transform 1s ease, opacity 1s ease';

  setTimeout(() => {
    expanse = false;
    returning = true;
    container.style.transform = 'scale(1.0)';
    container.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease';
    document.body.style.opacity = '0';

   
    setTimeout(() => {
      returning = false;
      window.location.href = 'https://niepmd.in/';
    }, 1000); 
  }, 1500); 
}



    startCountdown();

    return () => {
      canvas.remove();
    };
  }, []);

  return (
    <>
  
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background:
            'conic-gradient(from 0deg, rgba(255,255,255,0) 0%, #ffffff 50%, rgba(255,255,255,0) 100%)',
          filter: 'blur(120px)',
          animation: 'rotateGlow 12s linear infinite',
          pointerEvents: 'none',
        }}
      ></div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        style={{
          height: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <div
          ref={hoverRef}
          style={{
            width: '255px',
            height: '255px',
            borderRadius: '50%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-128px',
            marginTop: '-128px',
            zIndex: 2,
            cursor: 'default',
            lineHeight: '255px',
            textAlign: 'center',
            backgroundColor: 'transparent',
            color: '#fff',
            fontFamily: 'serif',
            fontSize: '80px',
            userSelect: 'none',
          }}
        >
          <span className={`countdown countdown-${countdown}`}>
            {countdown >= 0 ? countdown : ''}
          </span>

          <style>
            {`
              @keyframes rotateGlow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }

              .countdown {
                display: inline-block;
                animation: scaleUp 1s ease forwards;
              }

              .countdown-5 { animation: scaleUp 1s ease forwards; }
              .countdown-4 { animation: rotateBounce 1s ease forwards; }
              .countdown-3 { animation: fadeRotate 1s ease forwards; }
              .countdown-2 { animation: jump 1s ease forwards; }
              .countdown-1 { animation: swing 1s ease forwards; }
              .countdown-0 { animation: pulseGlow 1s ease forwards; }

              @keyframes scaleUp {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.8); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }

              @keyframes rotateBounce {
                0% { transform: rotate(-45deg) scale(0.5); opacity: 0; }
                50% { transform: rotate(30deg) scale(1.5); opacity: 1; }
                100% { transform: rotate(0deg) scale(1); opacity: 1; }
              }

              @keyframes fadeRotate {
                0% { opacity: 0; transform: rotate(90deg) scale(0.5); }
                50% { opacity: 1; transform: rotate(-20deg) scale(1.5); }
                100% { opacity: 1; transform: rotate(0deg) scale(1); }
              }

              @keyframes jump {
                0% { transform: translateY(50px) scale(0.5); opacity: 0; }
                50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
              }

              @keyframes swing {
                0% { transform: rotate(-30deg) scale(0.5); opacity: 0; }
                50% { transform: rotate(15deg) scale(1.5); opacity: 1; }
                100% { transform: rotate(0deg) scale(1); opacity: 1; }
              }

              @keyframes pulseGlow {
                0% { transform: scale(0.5); opacity: 0; text-shadow: none; }
                50% { transform: scale(1.5); opacity: 1; text-shadow: 0 0 30px #fff; }
                100% { transform: scale(1); opacity: 1; text-shadow: 0 0 10px #fff; }
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
}
