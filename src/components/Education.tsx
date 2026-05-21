import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const educationList = [
  {
    degree: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
    school: 'IES Doctor Balmis',
    location: 'Alicante (España)',
    date: '2023 - 2026',
    desc: 'Especialización avanzada en tecnologías web modernas frontend y backend, bases de datos complejas, patrones de arquitectura de software y metodologías ágiles.',
    badge: 'Grado Superior'
  },
  {
    degree: 'Técnico en Sistemas Microinformáticos y Redes (SMR)',
    school: 'IES Doctor Balmis',
    location: 'Alicante (España)',
    date: '2021 - 2023',
    desc: 'Formación profunda en administración de sistemas operativos de red, cableado estructurado, seguridad informática, hardware de computadoras y montaje técnico de servidores.',
    badge: 'Grado Medio'
  }
];

const Education = () => {
  return (
    <section id="education" className="py-24 relative bg-gray-50/40 dark:bg-[#0a0e1a]/20 transition-colors duration-300 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[30%] left-[80%] w-[380px] h-[380px] bg-accent-500/5 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="mb-20 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start gap-4">
            <span className="text-accent-500 font-mono text-2xl md:text-3xl">05.</span> Formación Académica
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 max-w-md hidden lg:block ml-4 transition-colors duration-300"></div>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mt-2 font-medium">
            Títulos académicos oficiales que respaldan mi conocimiento especializado en sistemas y desarrollo de software.
          </p>
        </motion.div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 md:ml-8 space-y-12 transition-colors duration-300">
          
          {educationList.map((item, index) => (
            <motion.div 
              key={index} 
              className="relative pl-8 md:pl-12 group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.18, ease: "easeOut" }}
            >
              
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[25px] top-1.5 bg-white dark:bg-[#0a0e1a] border-2 border-gray-300 dark:border-gray-800 group-hover:border-accent-500 dark:group-hover:border-accent-400 rounded-full p-2.5 transition-all duration-300 z-10 shadow-md group-hover:shadow-[0_0_12px_#2563eb80] group-hover:scale-110">
                <GraduationCap size={18} className="text-accent-500 dark:text-accent-400" />
              </div>

              {/* Glassmorphic Content Card */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800/80 rounded-3xl p-6 md:p-8 hover:border-accent-500/40 dark:hover:border-accent-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-accent-500/5 dark:hover:shadow-accent-500/10 relative overflow-hidden"
              >
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.01] to-blue-500/[0.01] pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 text-left">
                  <div>
                    {/* Degree and Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-black font-mono text-accent-600 dark:text-accent-400 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
                      {item.degree}
                    </h3>

                    {/* School and Location */}
                    <div className="flex flex-wrap items-center text-sm font-semibold text-gray-500 dark:text-gray-400 gap-3 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Award size={14} className="text-accent-500/60" />
                        {item.school}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block" />
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-accent-500/60" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Calendar Badge */}
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent-600 dark:text-accent-400 bg-accent-500/10 border border-accent-500/20 px-3 py-1.5 rounded-full w-fit">
                    <Calendar size={13} />
                    {item.date}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mt-4 text-left border-t border-gray-150 dark:border-gray-800/80 pt-4">
                  {item.desc}
                </p>

              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
