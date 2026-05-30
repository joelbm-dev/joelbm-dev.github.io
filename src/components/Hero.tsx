import { useState, useEffect, useRef } from 'react';
import { Download, Mail, ChevronDown } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { magicalSynth } from './Header';

/* ─────────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────────── */
type Phase = 'typing' | 'pausing' | 'deleting';

function useTypewriter(words: string[], typeSpeed = 75, deleteSpeed = 40, pauseMs = 2200) {
  const [charIndex, setCharIndex]   = useState(0);
  const [wordIndex, setWordIndex]   = useState(0);
  const [phase, setPhase]           = useState<Phase>('typing');

  useEffect(() => {
    const word = words[wordIndex % words.length];
    if (phase === 'typing') {
      if (charIndex < word.length) {
        const t = setTimeout(() => setCharIndex(i => i + 1), typeSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('deleting'), pauseMs);
      return () => clearTimeout(t);
    }
    if (phase === 'deleting') {
      if (charIndex > 0) {
        const t = setTimeout(() => setCharIndex(i => i - 1), deleteSpeed);
        return () => clearTimeout(t);
      }
      setWordIndex(i => i + 1);
      setPhase('typing');
    }
  }, [charIndex, phase, wordIndex, words, typeSpeed, deleteSpeed, pauseMs]);

  return words[wordIndex % words.length].slice(0, charIndex);
}

/* ─────────────────────────────────────────────
   High-Fantasy Floating Motes (KH & FF Theme)
───────────────────────────────────────────── */
const FANTASY_PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const glyphs = ['✦', '✨', '⭐', '💛'];
  return {
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    char: glyphs[Math.floor(Math.random() * glyphs.length)],
    size: Math.random() * 10 + 6, // 6px to 16px
    duration: Math.random() * 12 + 6, // slower, floating majestically
    delay: Math.random() * 5,
    color: i % 2 === 0 ? 'rgba(212, 175, 55, 0.25)' : 'rgba(251, 191, 36, 0.25)', // Warm Gold and Amber Yellow
  };
});

/* ─────────────────────────────────────────────
   Mouse-parallax hook
───────────────────────────────────────────── */
function useParallax(strength = 20) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 60, damping: 18 });
  const sy = useSpring(ry, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * strength;
      const ny = (e.clientY / window.innerHeight - 0.5) * strength;
      rx.set(nx);
      ry.set(ny);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [rx, ry, strength]);

  return { x: sx, y: sy };
}

/* ─────────────────────────────────────────────
   Floating badge around photo
───────────────────────────────────────────── */
interface BadgeProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  style: React.CSSProperties;
  floatY: number[];
  duration: number;
  delay?: number;
  href?: string;
}

function FloatingBadge({ icon, color, label, style, floatY, duration, delay = 0, href }: BadgeProps) {
  const inner = (
    <motion.div
      className="absolute flex flex-col items-center gap-1 z-20 cursor-pointer"
      style={style}
      animate={{ y: floatY }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      whileHover={{ scale: 1.18 }}
    >
      <div
        className="p-3 rounded-full shadow-xl border border-white/20 dark:border-white/10 backdrop-blur-sm"
        style={{ background: `${color}18`, boxShadow: `0 0 18px ${color}40` }}
      >
        <span style={{ color, fontSize: 28, display: 'block', lineHeight: 1 }}>{icon}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
        {label}
      </span>
    </motion.div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer">{inner}</a>;
  }
  return inner;
}

/* ─────────────────────────────────────────────
   Stats
───────────────────────────────────────────── */
const stats = [
  { value: '1',   label: 'Año de experiencia' },
  { value: '20+', label: 'Tecnologías dominadas' },
  { value: '2',   label: 'Proyectos completados' },
];

/* ─────────────────────────────────────────────
   Interactive HTML5 Canvas Network Background
───────────────────────────────────────────── */
function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isIntersecting = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Limit nodes on mobile for maximum performance
    const nodeCount = width < 768 ? 22 : 60;
    const maxDistance = 110;
    const mouseMaxDistance = 160;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const nodes: Node[] = [];
    const colors = ['#ffd700', '#fbbf24', '#f59e0b', '#d4af37']; // Gold, Amber, Orange-Gold, Soft Gold

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 2 - 1) * 0.35,
        vy: (Math.random() * 2 - 1) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Relative to screen client
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // IntersectionObserver to pause simulation when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          loop();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.02 }
    );
    
    observer.observe(canvas);

    const loop = () => {
      if (!isIntersecting.current) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce borders
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Connect/interact with mouse
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseMaxDistance) {
          const force = (mouseMaxDistance - dist) / mouseMaxDistance;
          node.vx -= (dx / dist) * force * 0.02;
          node.vy -= (dy / dist) * force * 0.02;

          // Connect directly to mouse with neon gold laser thread
          ctx.strokeStyle = `rgba(212, 175, 55, ${force * 0.28})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }

        // Draw node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Connect nearby nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

          if (dist < maxDistance) {
            const alpha = (maxDistance - dist) / maxDistance;
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ─────────────────────────────────────────────
   Roles for typewriter
───────────────────────────────────────────── */
const ROLES = [
  'Desarrollador Web Full Stack',
  'Técnico de Sistemas y Redes',
  'Especialista en RPA',
];

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = () => {
  const typed   = useTypewriter(ROLES);
  const { x, y } = useParallax(14);

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden"
    >
      {/* ── Aurora blobs ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right: glowing gold */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 dark:opacity-35"
          style={{ top: '-15%', right: '-10%', background: 'radial-gradient(circle, #d4af37, transparent)' }}
          animate={{ scale: [1, 1.25, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Bottom-left: starlight blue */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 dark:opacity-30"
          style={{ bottom: '-10%', left: '-10%', background: 'radial-gradient(circle, #38bdf8, transparent)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Center-top: royal bronze gold */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[90px] opacity-10 dark:opacity-25"
          style={{ top: '10%', left: '30%', background: 'radial-gradient(circle, #aa8410, transparent)' }}
          animate={{ scale: [1, 1.2, 1], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* ── Floating interactive network graph background ── */}
      <NetworkBackground />

      {/* ── Floating high-fantasy motes ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {FANTASY_PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="absolute font-sans font-black pointer-events-none"
            style={{ left: p.x, top: p.y, fontSize: p.size, color: p.color }}
            animate={{ 
              y: [0, -60, 0], 
              opacity: [0.15, 0.75, 0.15],
              rotate: [0, 360, 0]
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-10">

          {/* ─────── LEFT ─────── */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Availability badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 mb-6 px-4 py-1.5 rounded-full border border-accent-500/30 bg-accent-500/5 backdrop-blur-sm shadow-sm font-cinzel">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
              </span>
              <span className="text-[10px] font-black text-accent-600 dark:text-accent-400 tracking-widest uppercase flex items-center gap-1">
                👑 ¡HOLA! (PROMETO QUE NO SOY UN ROBOT) SOY
              </span>
            </motion.div>

            {/* Name — shimmer */}
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black mb-4 tracking-tight leading-none"
            >
              <span className="shimmer-text">Joel</span>
              <br />
              <span className="text-gray-900 dark:text-white">Barreira</span>
            </motion.h1>

            {/* Typewriter role */}
            <motion.div
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium mb-6 h-9 flex items-center justify-center lg:justify-start"
            >
              <span>{typed}</span>
              <span className="cursor-blink" />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8 leading-relaxed mx-auto lg:mx-0"
            >
              Apasionado por construir soluciones digitales robustas y elegantes — desde interfaces modernas hasta automatización de procesos críticos.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 font-cinzel text-xs tracking-wider"
            >
              <motion.a
                href="/cv.pdf"
                target="_blank"
                onMouseEnter={() => magicalSynth.playChime()}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-gray-950 font-black rounded-xl transition-all w-full sm:w-auto justify-center shadow-lg shadow-accent-500/30 border border-accent-400/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] uppercase"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={18} />
                Descargar CV
              </motion.a>
              <motion.a
                href="mailto:joel.barreira@outlook.com"
                onMouseEnter={() => magicalSynth.playChime()}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 hover:border-accent-500 hover:text-accent-500 text-gray-700 dark:text-gray-300 rounded-xl font-black transition-all w-full sm:w-auto justify-center hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] uppercase"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail size={18} />
                Contactar
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-8"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-black text-accent-500 dark:text-accent-400">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5 max-w-[80px]">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ─────── RIGHT — Photo ─────── */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          >
            {/* Outer wrapper — extra space for floating badges */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px]">

              {/* ── Spinning dashed SVG ring (outer) ── */}
              <motion.div
                className="absolute inset-[-18%] z-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#d4af37" stopOpacity="0.95" />
                      <stop offset="50%"  stopColor="#fbbf24" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ringGrad)" strokeWidth="0.8" strokeDasharray="4 6" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* ── Counter-spinning inner dashed ring ── */}
              <motion.div
                className="absolute inset-[-8%] z-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#f3e5ab" strokeWidth="0.5" strokeDasharray="1 7" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* ── Aurora glow blob behind photo ── */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl z-0 opacity-50 dark:opacity-60"
                style={{ background: 'radial-gradient(circle at 40% 40%, rgba(212, 175, 55, 0.28), rgba(251, 191, 36, 0.18), transparent)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ── Profile image ── */}
              <motion.div
                className="absolute inset-[8%] rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl z-10"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              >
                {/* Glowing border overlay */}
                <div className="absolute inset-0 rounded-[2rem] ring-2 ring-accent-500/40 dark:ring-accent-400/30 z-10 pointer-events-none" />
                <img
                  src="/profile.jpg"
                  alt="Joel Barreira"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* ─── Floating badges ─── */}

              {/* GitHub — top-left */}
              <FloatingBadge
                icon={<FaGithub className="text-gray-800 dark:text-white" />}
                color="currentColor"
                label="GitHub"
                href="https://github.com/joelbm-dev"
                style={{ top: '2%', left: '-8%' }}
                floatY={[0, -14, 0]}
                duration={5}
                delay={0}
              />

              {/* LinkedIn — bottom-right */}
              <FloatingBadge
                icon={<FaLinkedin />}
                color="#0A66C2"
                label="LinkedIn"
                href="https://www.linkedin.com/in/joel-barreira-1b9ab6366"
                style={{ bottom: '2%', right: '-8%' }}
                floatY={[0, 14, 0]}
                duration={4.5}
                delay={1}
              />



            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 dark:text-gray-600 hidden md:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
};

export default Hero;
