import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   CELESTIAL CHIME SYNTH (WEB AUDIO API)
   Generates a pure magical crystal arpeggio sweep upon navigation menu hovers
───────────────────────────────────────────────────────────────────────────── */
class MagicalSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    // Ascending pure arpeggio: C6 -> E6 -> G6 -> C7
    const notes = [1046.50, 1318.51, 1567.98, 2093.00];

    notes.forEach((freq, idx) => {
      const delay = idx * 0.042; // Fast majestic arpeggio
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine'; // pure whistles like crystals
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.035, t + delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.16);
    });
  }
}

export const magicalSynth = new MagicalSynth();

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial theme check
    if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navLinks = [
    { name: 'Sobre mí', href: '#about' },
    { name: 'Habilidades', href: '#skills' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Experiencia', href: '#experience' },
    { name: 'Formación', href: '#education' },
    { name: 'Arcade', href: '#arcade' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-kh-bg-primary/80 backdrop-blur-md border-b border-kh-border shadow-sm dark:shadow-none' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Majestic Final Fantasy inspired gold-shadow logo */}
          <div className="text-lg font-black font-cinzel-dec tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform duration-200 cursor-default select-none">
            &lt;JOELBM-DEV/&gt;
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center font-cinzel">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  magicalSynth.playChime();
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative text-[11px] font-black uppercase tracking-widest text-kh-muted hover:text-accent-500 dark:hover:text-accent-400 transition-colors py-1 px-1.5 flex items-center gap-1.5"
              >
                {hoveredIdx === idx && (
                  <motion.span
                    layoutId="header-crown"
                    className="text-[10px] text-accent-500 drop-shadow-[0_0_5px_#d4af37] z-10"
                    initial={{ scale: 0.6, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    👑
                  </motion.span>
                )}
                {link.name}
              </a>
            ))}
            
            <button
              onClick={toggleTheme}
              onMouseEnter={() => magicalSynth.playChime()}
              className="p-2 rounded-full text-kh-muted hover:text-kh-text hover:bg-accent-500/10 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <a
              href="mailto:joel.barreira@outlook.com"
              onMouseEnter={() => magicalSynth.playChime()}
              className="px-4 py-2 rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 hover:bg-accent-500 hover:text-gray-950 font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all text-[11px] uppercase tracking-wider"
            >
              Contactar
            </a>
          </nav>
  
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-kh-muted hover:text-kh-text hover:bg-accent-500/10 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-kh-muted hover:text-kh-text transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
  
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-kh-bg-primary border-b border-kh-border shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  magicalSynth.playChime();
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider text-kh-muted hover:text-accent-500 dark:hover:text-accent-400 hover:bg-accent-500/5 font-cinzel transition-all"
              >
                {hoveredIdx === idx && <span className="text-[10px] text-accent-500">👑</span>}
                {link.name}
              </a>
            ))}
            <a
              href="mailto:joel.barreira@outlook.com"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center mt-4 px-4 py-2.5 rounded-xl bg-accent-500 text-gray-950 font-bold uppercase tracking-wider font-cinzel text-xs"
            >
              Contactar
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
