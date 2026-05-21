import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Shield, Award, Zap, Code, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  date: string;
  type: string;
  icon: React.ReactNode;
  points: string[];
  tags: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'Desarrollador RPA (Prácticas)',
    company: 'NTT DATA',
    location: 'Alicante (España)',
    date: '03/2026 - 05/2026',
    type: 'rpa',
    icon: <Zap size={18} />,
    points: [
      'Automatización e implementación de flujos de trabajo eficientes utilizando herramientas líderes del sector como UiPath, Blue Prism y el motor BPM de Camunda.',
      'Participación activa en proyectos reales orientados a la optimización de tareas operativas críticas.',
      'Colaboración estrecha con equipos multidisciplinares bajo el marco de la metodología ágil Scrum.'
    ],
    tags: ['UiPath', 'Blue Prism', 'Camunda', 'BPMN 2.0', 'Scrum', 'Optimización']
  },
  {
    role: 'Desarrollador Web (Prácticas)',
    company: 'NTT DATA',
    location: 'Alicante (España)',
    date: '03/2025 - 04/2025',
    type: 'web',
    icon: <Code size={18} />,
    points: [
      'Formación corporativa intensiva y desarrollo práctico de proyectos de software utilizando Java y SQL.',
      'Ejecución de validación de código limpio, pruebas de concepto estables y optimización de consultas a bases de datos relacionales.',
      'Estandarización y redacción de documentación técnica de software según los estándares corporativos de calidad.'
    ],
    tags: ['Java', 'SQL', 'Bases de Datos', 'Pruebas de Concepto', 'Documentación Técnica']
  },
  {
    role: 'Técnico de Sistemas (Prácticas)',
    company: 'Ayuntamiento de Alicante',
    location: 'Alicante (España)',
    date: '03/2023 - 06/2023',
    type: 'sistemas',
    icon: <Server size={18} />,
    points: [
      'Configuración técnica, mantenimiento preventivo y puesta a punto de ordenadores corporativos, PDAs de policía e impresoras de red.',
      'Gestión de logística, instalación física de infraestructuras de telecomunicación y conectividad local.',
      'Control riguroso del inventariado de hardware y software corporativo de la administración pública.'
    ],
    tags: ['Sistemas', 'Redes', 'Windows Server', 'Linux', 'Instalación Física', 'Inventario']
  }
];

const Experience = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentExp = experiences[activeIdx];

  return (
    <section id="experience" className="py-24 relative bg-white dark:bg-[#0a0e1a]/40 transition-colors duration-300 overflow-hidden">
      
      {/* Background ambient decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-60">
        <div className="absolute top-[20%] right-[80%] w-[450px] h-[450px] bg-accent-500/5 rounded-full blur-[90px]" />
        <div className="absolute bottom-[20%] left-[80%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="mb-16 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center lg:justify-start gap-4">
            <span className="text-accent-500 font-mono text-2xl md:text-3xl">04.</span> Experiencia Profesional
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 max-w-md hidden lg:block ml-4 transition-colors duration-300"></div>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mt-2 font-medium">
            Mis prácticas y colaboraciones reales en empresas y administración pública, consolidando conocimiento técnico directo sobre el terreno.
          </p>
        </motion.div>

        {/* Modular Terminal Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800/80 rounded-3xl p-6 md:p-8 hover:border-accent-500/30 dark:hover:border-accent-500/30 transition-all duration-300 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.01] to-blue-500/[0.01] pointer-events-none" />

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap border-b border-gray-150 dark:border-gray-800/80 mb-8 gap-2">
            {experiences.map((exp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold rounded-t-xl transition-all border-b-2 -mb-[2px] ${
                  activeIdx === idx
                    ? 'border-accent-500 text-accent-600 dark:text-accent-400 bg-accent-500/[0.03]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {exp.icon}
                <span className="whitespace-nowrap">{exp.company} — {exp.type === 'rpa' ? 'RPA' : exp.type === 'web' ? 'Web' : 'Sistemas'}</span>
              </button>
            ))}
          </div>

          {/* Active Experience Info Details */}
          <div className="min-h-[260px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-left"
              >
                {/* Header Information block (No percentages as requested) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800/60">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                      {currentExp.role}
                    </h3>
                    
                    <div className="flex flex-wrap items-center text-sm font-semibold text-gray-500 dark:text-gray-400 gap-3 mt-1.5">
                      <span className="flex items-center gap-1.5">
                        <Award size={15} className="text-accent-500" />
                        {currentExp.company}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block" />
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-accent-500" />
                        {currentExp.location}
                      </span>
                    </div>
                  </div>

                  {/* Calendar Dates */}
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent-600 dark:text-accent-400 bg-accent-500/10 border border-accent-500/20 px-3.5 py-2 rounded-xl w-fit">
                      <Calendar size={13} />
                      {currentExp.date}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                      <Shield size={10} className="text-emerald-500" /> Periodo de Prácticas
                    </span>
                  </div>
                </div>

                {/* Accomplishment Bullet points */}
                <ul className="space-y-4 pl-1">
                  {currentExp.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      <ArrowRight size={15} className="text-accent-500 dark:text-accent-400 mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Technical Tags footer */}
            <div className="flex flex-wrap gap-2.5 mt-8 pt-5 border-t border-gray-150 dark:border-gray-800/80">
              {currentExp.tags.map((t, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-black font-mono text-accent-600 dark:text-accent-400 bg-accent-500/5 dark:bg-accent-500/10 px-3 py-1 rounded-lg border border-accent-500/15"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Experience;
