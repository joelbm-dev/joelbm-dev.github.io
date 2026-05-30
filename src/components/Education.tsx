import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { magicalSynth } from './Header';

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
    <section id="education" className="py-24 relative bg-kh-bg-primary transition-colors duration-300 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[30%] left-[80%] w-[380px] h-[380px] bg-accent-500/5 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="mb-20 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-kh-text mb-6 text-center font-cinzel tracking-wide leading-tight">
            👑 Formación <span className="shimmer-text">Académica</span>
          </h2>
          <p className="text-lg text-kh-muted max-w-3xl mt-2 font-medium mx-auto">
            Títulos académicos oficiales que respaldan mi conocimiento especializado en sistemas y desarrollo de software.
          </p>
        </motion.div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-accent-500/30 border-dashed ml-4 md:ml-8 space-y-12 transition-colors duration-300">
          
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
              <div className="absolute -left-[25px] top-1.5 bg-kh-bg-primary border-2 border-accent-500/30 group-hover:border-accent-500 rounded-full p-2.5 transition-all duration-300 z-10 shadow-md group-hover:shadow-[0_0_15px_rgba(212,175,55,0.45)] group-hover:scale-110">
                <GraduationCap size={18} className="text-accent-500" />
              </div>

              {/* Glassmorphic Content Card */}
              <motion.div 
                whileHover={{ 
                  y: -5, 
                  scale: 1.01,
                  boxShadow: '0 15px 30px -10px rgba(212,175,55,0.12), 0 10px 15px -12px rgba(212,175,55,0.08)',
                  borderColor: 'rgba(212, 175, 55, 0.45)'
                }}
                onMouseEnter={() => magicalSynth.playChime()}
                className="bg-kh-bg-card backdrop-blur-md border border-kh-border rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-lg relative overflow-hidden"
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

                    <h3 className="text-xl md:text-2xl font-black text-kh-text group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
                      {item.degree}
                    </h3>

                    {/* School and Location */}
                    <div className="flex flex-wrap items-center text-sm font-semibold text-kh-muted gap-3 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Award size={14} className="text-accent-500/60" />
                        {item.school}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-kh-border hidden sm:block" />
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-accent-500/60" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Calendar Badge */}
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent-600 dark:text-accent-400 bg-accent-500/10 border border-accent-500/20 px-3 py-1.5 rounded-full w-fit whitespace-nowrap shrink-0 md:mt-1">
                    <Calendar size={13} />
                    {item.date}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-kh-muted leading-relaxed font-medium mt-4 text-left border-t border-kh-border pt-4">
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
