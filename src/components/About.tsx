import { Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 relative bg-white dark:bg-[#0a0e1a]/40 transition-colors duration-300 overflow-hidden">
      
      {/* Subtle Background Blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[80%] w-[350px] h-[350px] bg-accent-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <motion.div 
          className="mb-16 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start gap-4">
            <span className="text-accent-500 font-mono text-2xl md:text-3xl">01.</span> Sobre mí
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 max-w-md hidden lg:block ml-4 transition-colors duration-300"></div>
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Biography Block */}
          <motion.div 
            className="lg:col-span-2 space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed font-medium text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p>
              ¡Hola! Mi nombre es <strong className="text-gray-900 dark:text-white font-extrabold">Joel Barreira</strong> y soy un profesional apasionado por fusionar el desarrollo de software moderno con la administración de sistemas informáticos complejos.
            </p>
            <p>
              Cuento con una sólida formación híbrida como <strong className="text-accent-600 dark:text-accent-400 font-bold">Técnico Superior en Desarrollo de Aplicaciones Web (DAW)</strong> y <strong className="text-accent-600 dark:text-accent-400 font-bold">Técnico en Sistemas Microinformáticos y Redes (SMR)</strong>. Esta combinación única me capacita para diseñar aplicaciones eficientes y estéticas mientras garantizo que toda la infraestructura de red, servidores y despliegue sea escalable, segura y completamente automatizada.
            </p>
            <p>
              A lo largo de mi trayectoria he colaborado en entornos exigentes como la multinacional <strong className="text-gray-900 dark:text-white font-semibold">NTT DATA</strong> y el <strong className="text-gray-900 dark:text-white font-semibold">Ayuntamiento de Alicante</strong>. En estas posiciones he implementado soluciones robustas y consolidado habilidades de <strong className="text-gray-900 dark:text-white font-semibold">automatización de procesos mediante RPA</strong> (UiPath, Blue Prism, Camunda), eliminando cuellos de botella operativos y optimizando flujos corporativos bajo metodologías ágiles como Scrum.
            </p>
            <p>
              Me considero un desarrollador proactivo, de mentalidad autodidacta y apasionado por la resolución creativa de problemas informáticos.
            </p>
          </motion.div>

          {/* Right Side Cards */}
          <div className="space-y-6">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.25 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 hover:border-accent-500/40 dark:hover:border-accent-500/40 shadow-xl hover:shadow-2xl hover:shadow-accent-500/5 dark:hover:shadow-accent-500/10 transition-all duration-300 relative overflow-hidden group text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.02] to-blue-500/[0.01] pointer-events-none" />
              <div className="p-3 bg-accent-500/10 dark:bg-accent-500/15 rounded-2xl w-fit text-accent-500 dark:text-accent-400 mb-5 shadow-inner">
                <Terminal size={24} />
              </div>
              <h3 className="text-gray-900 dark:text-white font-black text-xl mb-2 flex items-center gap-2">
                Desarrollo Software
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold leading-relaxed">
                Construcción de aplicaciones web interactivas (React/Angular), microservicios en Spring Boot y automatizaciones de flujos empresariales inteligentes (RPA).
              </p>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.35 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 hover:border-accent-500/40 dark:hover:border-accent-500/40 shadow-xl hover:shadow-2xl hover:shadow-accent-500/5 dark:hover:shadow-accent-500/10 transition-all duration-300 relative overflow-hidden group text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.02] to-blue-500/[0.01] pointer-events-none" />
              <div className="p-3 bg-accent-500/10 dark:bg-accent-500/15 rounded-2xl w-fit text-accent-500 dark:text-accent-400 mb-5 shadow-inner">
                <Cpu size={24} />
              </div>
              <h3 className="text-gray-900 dark:text-white font-black text-xl mb-2 flex items-center gap-2">
                Sistemas y Redes
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold leading-relaxed">
                Despliegue y administración de servidores (Linux/Windows Server), configuraciones de red estructuradas, virtualización distribuidora y soporte de hardware.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
