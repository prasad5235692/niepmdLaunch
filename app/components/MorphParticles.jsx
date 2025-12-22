
'use client';

import { useEffect,useState , useRef } from 'react';
import { useRouter } from 'next/navigation';
import p5 from 'p5';
import { motion, AnimatePresence } from "framer-motion";
import './morphParticles.css'; 

export default function MorphParticles() {
  const containerRef = useRef();
  const router = useRouter();
  

  useEffect(() => {
    const sketch = (p) => {
      const PARTICLES_COUNT = 1500;
      const MAX_SPEED = 8.0;
      const MAX_FORCE = 0.9;
      const MORPH_DURATION = 45;

const CIRCLE = 0;
const SQUARE = 1;
const TRIANGLE = 2;
const STAR = 3;
const TOTAL_SHAPES = 4;


      let particles = [];
      let SHAPE_RADIUS;

      let currentShape = 0;
      let targetShape = 0;
      let isMorphing = false;
      let morphFrame = 0;

      class Particle {
        constructor() {
          this.pos = p.createVector();
          this.vel = p.createVector();
          this.acc = p.createVector();
          this.prevPos = p.createVector();
          this.maxSpeed = p.random(1, MAX_SPEED);
          this.maxForce = p.random(0.05, MAX_FORCE);
          this.size = p.random(0.5, 4.5);
        }

        seek(target) {
          let desired = p5.Vector.sub(target, this.pos);
          desired.setMag(this.maxSpeed);
          let steer = p5.Vector.sub(desired, this.vel);
          steer.limit(this.maxForce);
          this.applyForce(steer);
        }

        applyForce(force) {
          this.acc.add(force);
        }

        update() {
          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.pos.add(this.vel);
          this.acc.mult(0);
        }

        draw() {
          const speed = this.vel.mag();
          const brightness = p.map(speed, 0, this.maxSpeed, 60, 100);
          const alpha = p.map(speed, 0, this.maxSpeed, 0.1, 0.8);
          const weight = p.map(speed, 0, this.maxSpeed, this.size * 0.5, this.size);

          p.stroke(0, 0, brightness, alpha);
          p.strokeWeight(weight);
          p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

          this.prevPos.set(this.pos);
        }
      }

      const getCirclePos = (angle, radius) => p.createVector(Math.cos(angle) * radius, Math.sin(angle) * radius);

      const getSquarePos = (angle, radius) => {
        let a = (angle + Math.PI / 4) % (Math.PI * 2);
        if (a < 0) a += Math.PI * 2;
        let t = Math.tan(a);
        let x = radius * Math.sign(Math.cos(a));
        let y = radius * t * Math.sign(Math.cos(a));
        if (Math.abs(y) > radius) {
          y = radius * Math.sign(y);
          x = radius / t * Math.sign(y);
        }
        return p.createVector(x, y);
      };

      const getTrianglePos = (angle, radius) => {
        angle -= Math.PI / 2;
        let a = angle % (Math.PI * 2);
        if (a < 0) a += Math.PI * 2;

        const sideIndex = Math.floor(a / (Math.PI * 2 / 3));
        const angleOnSide = a % (Math.PI * 2 / 3);

        const p1 = p.createVector(Math.cos(sideIndex * Math.PI * 2 / 3), Math.sin(sideIndex * Math.PI * 2 / 3)).mult(radius);
        const p2 = p.createVector(Math.cos((sideIndex + 1) * Math.PI * 2 / 3), Math.sin((sideIndex + 1) * Math.PI * 2 / 3)).mult(radius);

        return p5.Vector.lerp(p1, p2, angleOnSide / (Math.PI * 2 / 3));
      };

      const getStarPos = (angle, radius) => {
        const outerRadius = radius;
        const innerRadius = radius * 0.5;
        const numPoints = 5;
        const angleStep = (Math.PI * 2) / (numPoints * 2);
        let a = angle - Math.PI / 2;
        const segment = Math.floor(a / angleStep);

        const startAngleOfSegment = segment * angleStep;

        const r1 = (segment % 2 === 0) ? outerRadius : innerRadius;
        const r2 = (segment % 2 === 0) ? innerRadius : outerRadius;

        const p1_angle = startAngleOfSegment;
        const p2_angle = startAngleOfSegment + angleStep;

        const p1 = p.createVector(Math.cos(p1_angle) * r1, Math.sin(p1_angle) * r1);
        const p2 = p.createVector(Math.cos(p2_angle) * r2, Math.sin(p2_angle) * r2);

        const t = (a - startAngleOfSegment) / angleStep;

        return p5.Vector.lerp(p1, p2, t);
      };

    function getShapePosition(shape, angle, radius) {
  switch (shape) {
    case CIRCLE:   return getCirclePos(angle, radius);
    case SQUARE:   return getSquarePos(angle, radius);
    case TRIANGLE: return getTrianglePos(angle, radius);
    case STAR:     return getStarPos(angle, radius);
    default:       return p.createVector(0, 0);
  }
}


      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.background(0);
        SHAPE_RADIUS = Math.min(p.width, p.height) * 0.3;

        for (let i = 0; i < PARTICLES_COUNT; i++) {
          let particle = new Particle();
          particle.pos.set(p.random(-p.width / 2, p.width / 2), p.random(-p.height / 2, p.height / 2));
          particle.prevPos.set(particle.pos);
          particles.push(particle);
        }

const interval = setInterval(() => {
  if (!isMorphing) {
    isMorphing = true;
    morphFrame = 0;
    targetShape = (currentShape + 1) % TOTAL_SHAPES;
  }
}, 800);

return () => {
  myP5.remove();
  clearInterval(interval);
};

      };

      p.draw = () => {
        p.background(0, 0, 0, 0.25);
        p.translate(p.width / 2, p.height / 2);

        if (isMorphing) {
          morphFrame++;
          if (morphFrame >= MORPH_DURATION) {
            isMorphing = false;
            morphFrame = 0;
            currentShape = targetShape;
          }
        }

        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          const angle = p.map(i, 0, PARTICLES_COUNT, 0, Math.PI * 2);
          const fromShapePos = getShapePosition(currentShape, angle, SHAPE_RADIUS);
          let targetPos;

          if (isMorphing) {
            const toShapePos = getShapePosition(targetShape, angle, SHAPE_RADIUS);
            const easedProgress = easeInOutCubic(morphFrame / MORPH_DURATION);
            targetPos = p5.Vector.lerp(fromShapePos, toShapePos, easedProgress);
          } else {
            targetPos = fromShapePos;
          }

          particle.seek(targetPos);
          particle.update();
          particle.draw();
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        SHAPE_RADIUS = Math.min(p.width, p.height) * 0.3;
        particles.forEach((particle, i) => {
          const angle = p.map(i, 0, PARTICLES_COUNT, 0, Math.PI * 2);
          const resetPos = getShapePosition(currentShape, angle, SHAPE_RADIUS);
          particle.pos.set(resetPos);
          particle.prevPos.set(resetPos);
        });
        p.background(0);
      };
    };

    const myP5 = new p5(sketch, containerRef.current);
    return () => myP5.remove();
  }, []);
  const [showAmbient, setShowAmbient] = useState(true);
 const [phase, setPhase] = useState('welcome');

useEffect(() => {
  const timer1 = setTimeout(() => {
    setPhase('coming');
  }, 3085);

  return () => clearTimeout(timer1);
}, []);



  const overlayVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.5 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.2 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.6 },
  },
};


  return (
<>

  <div ref={containerRef} className="canvas-layer" />
  <AnimatePresence>
    {phase === "welcome" && (
      <motion.div
        key="ambient"
        className="ambient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    )}
  </AnimatePresence>


  <AnimatePresence mode="wait">
     {showAmbient && (
      <motion.div
        key="welcome"
        className="glass-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.h1 className="title-glow">
          Welcome
        </motion.h1>
      </motion.div>
    )}

    {phase === "coming" && (
      <motion.div
        key="coming"
        className="glass-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h1
          className="title-glow1 font-semibold"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Launch of Online Portal of Recruitment, Course Admission and Student
          Management Systems
        </motion.h1>

        <motion.p
          className="subtitle"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          A new experience is launching
        </motion.p>

        <motion.button
          className="launch-btn"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push("/countdown")}
        >
          Launch Website
        </motion.button>
      </motion.div>
    )}
  </AnimatePresence>
</>

  );
}
