import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Arcade from './components/Arcade';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-kh-bg-primary text-kh-text font-sans selection:bg-accent-500/30 selection:text-gray-900 dark:selection:text-white transition-colors duration-300 dot-grid">
      <Header />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Arcade />
      </main>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative bg-kh-bg-primary border-t border-kh-border transition-colors duration-300">
        <motion.div 
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-kh-text mb-6 text-center font-cinzel tracking-wide leading-tight">
            👑 Ponte en <span className="shimmer-text">Contacto</span>
          </h2>
          <p className="text-kh-muted text-lg mb-10">
            Actualmente estoy en búsqueda activa de nuevas oportunidades laborales. 
            Ya sea que tengas una propuesta, una pregunta o simplemente quieras saludar, mi bandeja de entrada siempre está abierta. ¡Intentaré responderte lo antes posible!
          </p>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:joel.barreira@outlook.com" 
            className="inline-flex px-8 py-4 bg-accent-500 text-gray-950 rounded-lg font-black hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/20"
          >
            Contactar
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
