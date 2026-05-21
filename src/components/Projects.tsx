import { useState, useEffect } from 'react';
import { ExternalLink, Cpu, Sparkles, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Project Specs
interface Project {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
}

const projects: Project[] = [
  {
    title: 'BlueCrew Web Portal',
    subtitle: 'Plataforma de Concienciación y Gestión de Eventos Marinos (ODS 14)',
    description: 'Aplicación web interactiva dedicada a la concienciación y gestión de eventos medioambientales para la conservación y protección de la vida submarina (ODS 14). Permite a los usuarios registrarse en jornadas de limpieza de playas y fondos marinos, y monitorizar el impacto ecológico acumulado en tiempo real.',
    tech: ['React', 'Bootstrap', 'Spring Boot', 'MySQL', 'Docker'],
    github: 'https://github.com/joelbm-dev/bluecrew-portal',
    demo: '#',
  },
  {
    title: 'BlueCrew Admin Panel',
    subtitle: 'Sistema de Administración para la Plataforma BlueCrew',
    description: 'Panel de control administrativo e integral para la plataforma BlueCrew. Cuenta con herramientas completas para la gestión y moderación de usuarios, aprobación y auditoría de eventos de conservación marina, y un módulo analítico de estadísticas de participación comunitaria.',
    tech: ['Angular', 'Bootstrap', 'Spring Boot', 'MySQL', 'Docker'],
    github: 'https://github.com/joelbm-dev/bluecrew-admin',
    demo: '#',
  }
];

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE CAROUSEL FOR BLUECREW ODS 14 WEB PORTAL (WEB1 to WEB5)
───────────────────────────────────────────────────────────────────────────── */
const WEB_IMAGES = [
  { src: '/WEB1.png', title: 'Página Principal' },
  { src: '/WEB2.png', title: 'Catálogo de Noticias' },
  { src: '/WEB3.png', title: 'Catálogo de Eventos' },
  { src: '/WEB4.png', title: 'Sobre Nosotros' },
  { src: '/WEB5.png', title: 'Login' },
];

const WebPortalCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % WEB_IMAGES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + WEB_IMAGES.length) % WEB_IMAGES.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 }
      }
    })
  };

  return (
    <div
      className="relative h-[220px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-950 group/carousel shadow-inner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 select-none pointer-events-none z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

      {/* Slide Container */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={WEB_IMAGES[currentIndex].src}
            alt={WEB_IMAGES[currentIndex].title}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); handlePrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-black/60 hover:bg-accent-500 text-white border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); handleNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-black/60 hover:bg-accent-500 text-white border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm"
      >
        <ChevronRight size={16} />
      </button>

      {/* Caption */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-0.5 text-left">
        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest font-mono">
          CAPTURA {currentIndex + 1} de {WEB_IMAGES.length}
        </span>
        <span className="text-xs font-bold text-white tracking-wide">
          {WEB_IMAGES[currentIndex].title}
        </span>
      </div>

      {/* Dots */}
      <div className="absolute top-4 right-4 z-20 flex gap-1.5">
        {WEB_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]'
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   INTERACTIVE SIMULATOR FOR BLUECREW ADMIN PANEL
───────────────────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────────────────
   INTERACTIVE SIMULATOR / CAROUSEL FOR BLUECREW ADMIN PANEL
   (Visualizes real administration panels ADMIN1 to ADMIN5)
───────────────────────────────────────────────────────────────────────────── */
const ADMIN_IMAGES = [
  { src: '/ADMIN1.png', title: 'Estadisticas de Actividad' },
  { src: '/ADMIN2.png', title: 'Gestión de Usuarios y Roles' },
  { src: '/ADMIN3.png', title: 'Moderación de Eventos y Noticias' },
  { src: '/ADMIN4.png', title: 'Asistente Virtual' },
  { src: '/ADMIN5.png', title: 'Login' }
];

const AdminPanelCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % ADMIN_IMAGES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + ADMIN_IMAGES.length) % ADMIN_IMAGES.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 }
      }
    })
  };

  return (
    <div 
      className="relative h-[220px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-950 group/carousel shadow-inner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 select-none pointer-events-none z-10 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

      {/* Slide Container */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={ADMIN_IMAGES[currentIndex].src}
            alt={ADMIN_IMAGES[currentIndex].title}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); handlePrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-black/60 hover:bg-accent-500 text-white border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); handleNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-black/60 hover:bg-accent-500 text-white border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md backdrop-blur-sm"
      >
        <ChevronRight size={16} />
      </button>

      {/* Title / Caption Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-0.5 text-left">
        <span className="text-[10px] text-accent-400 font-black uppercase tracking-widest font-mono">
          CAPTURA {currentIndex + 1} de {ADMIN_IMAGES.length}
        </span>
        <span className="text-xs font-bold text-white tracking-wide">
          {ADMIN_IMAGES[currentIndex].title}
        </span>
      </div>

      {/* Indicators Dots */}
      <div className="absolute top-4 right-4 z-20 flex gap-1.5">
        {ADMIN_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-5 bg-accent-500 shadow-[0_0_8px_#3b82f6]' 
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECTS COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Projects = () => {
  return (
    <section id="projects" className="py-24 relative bg-gray-50/40 dark:bg-gray-950/20 transition-colors duration-300 overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-60">
        <div className="absolute top-[30%] left-[85%] w-[450px] h-[450px] bg-accent-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[85%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <motion.div 
          className="mb-20 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start gap-4">
            <span className="text-accent-500 font-mono text-2xl md:text-3xl">03.</span> Proyectos Principales
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 max-w-md hidden lg:block ml-4 transition-colors duration-300"></div>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mt-2 font-medium">
            Una exhibición de los proyectos insignia construidos para dar soluciones eficaces al cuidado medioambiental y la administración a gran escala.
          </p>
        </motion.div>

        {/* 2-Column Complex Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {projects.map((project, idx) => {
            const isFirst = idx === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: idx * 0.15 }}
                className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800/80 rounded-3xl p-8 hover:border-accent-500/40 dark:hover:border-accent-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-accent-500/5 dark:hover:shadow-accent-500/10 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Glass Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.02] to-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Top Interactive Panel (Simulators) */}
                  <div className="relative mb-6 group-hover:scale-[1.01] transition-transform duration-300">
                    <div className="absolute inset-0 bg-accent-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      {isFirst ? <WebPortalCarousel /> : <AdminPanelCarousel />}
                    </div>
                  </div>

                  {/* Badges and Interactive Icons */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-accent-500 dark:text-accent-400 bg-accent-500/5 dark:bg-accent-500/10 px-3 py-1.5 rounded-xl border border-accent-500/10">
                      {isFirst ? <Droplets size={16} className="text-cyan-500 animate-pulse" /> : <Cpu size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                        {isFirst ? 'ODS 14: Vida Submarina' : 'Panel de Administración'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <motion.a 
                        href={project.github} 
                        target="_blank" 
                        rel="noreferrer"
                        whileHover={{ scale: 1.15, y: -2 }}
                        className="p-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 rounded-xl transition-all shadow-sm"
                      >
                        <FaGithub size={18} />
                      </motion.a>
                      <motion.a 
                        href={project.demo} 
                        whileHover={{ scale: 1.15, y: -2 }}
                        className="p-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 rounded-xl transition-all shadow-sm"
                      >
                        <ExternalLink size={18} />
                      </motion.a>
                    </div>
                  </div>

                  {/* Project Info */}
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 tracking-wide">
                    {project.subtitle}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8">
                    {project.description}
                  </p>
                </div>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-2.5 mt-auto pt-4 border-t border-gray-150 dark:border-gray-800/80">
                  {project.tech.map((t, index) => (
                    <span 
                      key={index} 
                      className="text-[10px] font-extrabold font-mono text-accent-600 dark:text-accent-400 bg-accent-500/5 dark:bg-accent-500/10 px-2.5 py-1 rounded-lg border border-accent-500/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic bottom call to action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.a 
            href="https://github.com/joelbm-dev" 
            target="_blank" 
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-accent-500 hover:text-accent-500 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all shadow-md dark:shadow-none"
          >
            <Sparkles size={18} className="text-accent-500 animate-pulse" />
            Explorar más proyectos en GitHub
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
