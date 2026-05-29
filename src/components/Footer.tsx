import { Mail, Heart } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-kh-bg-primary border-t border-kh-border pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-8 mb-12">
          <div className="flex justify-center items-center gap-6 w-full">
            <a
              href="https://github.com/joelbm-dev"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-kh-bg-card border border-kh-border text-kh-muted hover:text-kh-text hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/joel-barreira-1b9ab6366"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-kh-bg-card border border-kh-border text-kh-muted hover:text-kh-text hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="mailto:joel.barreira@outlook.com"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-kh-bg-card border border-kh-border text-kh-muted hover:text-kh-text hover:border-accent-500 dark:hover:border-accent-500 transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-kh-border text-center flex flex-col items-center justify-center text-sm text-kh-muted transition-colors duration-300">
          <p className="flex items-center gap-1 mb-2">
            Desarrollado con <Heart size={14} className="text-accent-500" /> y
            React
          </p>
          <p>
            &copy; {new Date().getFullYear()} joelbm-dev. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
