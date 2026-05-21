import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

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
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-[#0a0e1a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-accent-600">
            &lt;joelbm-dev/&gt;
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-accent-500 dark:hover:text-accent-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="mailto:joel.barreira@outlook.com"
              className="px-4 py-2 rounded-md bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 hover:bg-accent-500 hover:text-white transition-all text-sm font-medium"
            >
              Contactar
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0e1a] border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {link.name}
              </a>
            ))}
            <a
              href="mailto:joel.barreira@outlook.com"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center mt-4 px-4 py-2 rounded-md bg-accent-500 text-white font-medium"
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
