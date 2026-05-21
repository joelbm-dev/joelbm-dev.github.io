import { useState, useEffect } from 'react';
import { Download, Mail, ChevronDown } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion, useMotionValue, useSpring } from 'framer-motion';

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
        className="p-3 rounded-2xl shadow-xl border border-white/20 dark:border-white/10 backdrop-blur-sm"
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
   Particle dots (subtle, background)
───────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 5,
}));

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
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden dot-grid"
    >
      {/* ── Aurora blobs ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right: electric blue */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 dark:opacity-30"
          style={{ top: '-15%', right: '-10%', background: 'radial-gradient(circle, #2563eb, transparent)' }}
          animate={{ scale: [1, 1.25, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Bottom-left: cyan */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 dark:opacity-25"
          style={{ bottom: '-10%', left: '-10%', background: 'radial-gradient(circle, #06b6d4, transparent)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Center-top: indigo */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[90px] opacity-10 dark:opacity-20"
          style={{ top: '10%', left: '30%', background: 'radial-gradient(circle, #6366f1, transparent)' }}
          animate={{ scale: [1, 1.2, 1], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-accent-400/30 dark:bg-accent-400/20"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
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
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-accent-500/30 bg-accent-500/5 backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-accent-600 dark:text-accent-400 tracking-wide">
                ¡Hola! (prometo que no soy un robot) Soy
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
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <motion.a
                href="/cv.pdf"
                target="_blank"
                className="flex items-center gap-2.5 px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center shadow-lg shadow-accent-500/30"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={19} />
                Descargar CV
              </motion.a>
              <motion.a
                href="mailto:joel.barreira@outlook.com"
                className="flex items-center gap-2.5 px-7 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-accent-500 hover:text-accent-600 dark:hover:text-accent-400 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center shadow-md dark:shadow-none"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail size={19} />
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
                      <stop offset="0%"   stopColor="#2563eb" stopOpacity="0.9" />
                      <stop offset="50%"  stopColor="#06b6d4" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ringGrad)" strokeWidth="0.6" strokeDasharray="3 5" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* ── Counter-spinning inner dashed ring ── */}
              <motion.div
                className="absolute inset-[-8%] z-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#60a5fa" strokeWidth="0.4" strokeDasharray="1 8" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* ── Aurora glow blob behind photo ── */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl z-0 opacity-50 dark:opacity-60"
                style={{ background: 'radial-gradient(circle at 40% 40%, #2563eb55, #06b6d433, transparent)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ── Profile image ── */}
              <motion.div
                className="absolute inset-[8%] rounded-[2rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl z-10"
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
                icon={<FaGithub />}
                color="#1f2937"
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
