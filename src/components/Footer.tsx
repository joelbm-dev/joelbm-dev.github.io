import { Mail, Heart } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Joel Barreira</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Desarrollador Web Full Stack creando experiencias digitales excepcionales.
            </p>
          </div>

          <div className="flex gap-6">
            <a 
              href="https://github.com/joelbm-dev" 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/joel-barreira-1b9ab6366" 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-accent-500 hover:border-accent-500 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href="mailto:joel.barreira@outlook.com" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-accent-500 hover:border-accent-500 transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-900 text-center flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
          <p className="flex items-center gap-1 mb-2">
            Desarrollado con <Heart size={14} className="text-accent-500" /> y React
          </p>
          <p>&copy; {new Date().getFullYear()} Joel Barreira. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
