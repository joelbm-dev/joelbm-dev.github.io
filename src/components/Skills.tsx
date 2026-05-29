import { Code2, Database, Cloud, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { magicalSynth } from './Header';
import { 
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaAngular, FaWordpress, 
  FaJava, FaPhp, FaAws, FaDocker, FaGitAlt, FaServer, 
  FaNetworkWired, FaWrench, FaHeadset
} from 'react-icons/fa';
import { 
  SiTypescript, SiSpringboot, SiSharp, SiMysql, SiUipath, SiCamunda 
} from 'react-icons/si';

// Custom SVG icon for Blue Prism
const BluePrismIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2L3 10L12 18L21 10L12 2Z" />
    <path d="M12 18L3 10L12 22L21 10L12 18Z" opacity="0.65" />
  </svg>
);

const skillIcons: Record<string, any> = {
  'HTML':                           <FaHtml5 />,
  'CSS':                            <FaCss3Alt />,
  'JavaScript':                     <FaJs />,
  'TypeScript':                     <SiTypescript />,
  'Angular':                        <FaAngular />,
  'React':                          <FaReact />,
  'WordPress':                      <FaWordpress />,
  'Java':                           <FaJava />,
  'C#':                             <SiSharp />,
  'PHP':                            <FaPhp />,
  'Spring Boot':                    <SiSpringboot />,
  'MySQL':                          <SiMysql />,
  'UiPath':                         <SiUipath />,
  'Blue Prism':                     <BluePrismIcon />,
  'Camunda':                        <SiCamunda />,
  'AWS':                            <FaAws />,
  'Docker':                         <FaDocker />,
  'Git':                            <FaGitAlt />,
  'Administración de Servidores':   <FaServer />,
  'Despliegue de Redes':            <FaNetworkWired />,
  'Configuración Hardware/Software':<FaWrench />,
  'Soporte Técnico':                <FaHeadset />,
};

const skillColors: Record<string, string> = {
  'HTML':                           'text-[#E34F26]',
  'CSS':                            'text-[#1572B6]',
  'JavaScript':                     'text-[#F7DF1E]',
  'TypeScript':                     'text-[#3178C6]',
  'Angular':                        'text-[#DD0031]',
  'React':                          'text-[#61DAFB]',
  'WordPress':                      'text-[#21759B]',
  'Java':                           'text-[#f89820]',
  'C#':                             'text-[#9B59B6]',
  'PHP':                            'text-[#777BB4]',
  'Spring Boot':                    'text-[#6DB33F]',
  'MySQL':                          'text-[#4479A1]',
  'UiPath':                         'text-[#FA4616]',
  'Blue Prism':                     'text-[#0080C6]',
  'Camunda':                        'text-[#FC5D0D]',
  'AWS':                            'text-[#FF9900]',
  'Docker':                         'text-[#2496ED]',
  'Git':                            'text-[#F05032]',
  'Administración de Servidores':   'text-[#10B981]',
  'Despliegue de Redes':            'text-[#3B82F6]',
  'Configuración Hardware/Software':'text-[#F59E0B]',
  'Soporte Técnico':                'text-[#8B5CF6]',
};

const skillHexColors: Record<string, string> = {
  'HTML':                           '#E34F26',
  'CSS':                            '#1572B6',
  'JavaScript':                     '#F7DF1E',
  'TypeScript':                     '#3178C6',
  'Angular':                        '#DD0031',
  'React':                          '#61DAFB',
  'WordPress':                      '#21759B',
  'Java':                           '#f89820',
  'C#':                             '#9B59B6',
  'PHP':                            '#777BB4',
  'Spring Boot':                    '#6DB33F',
  'MySQL':                          '#4479A1',
  'UiPath':                         '#FA4616',
  'Blue Prism':                     '#0080C6',
  'Camunda':                        '#FC5D0D',
  'AWS':                            '#FF9900',
  'Docker':                         '#2496ED',
  'Git':                            '#F05032',
  'Administración de Servidores':   '#10B981',
  'Despliegue de Redes':            '#3B82F6',
  'Configuración Hardware/Software':'#F59E0B',
  'Soporte Técnico':                '#8B5CF6',
};

const skillCategories = [
  {
    title: 'Frontend y CMS',
    icon: <Code2 size={28} />,
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'WordPress'],
  },
  {
    title: 'Backend y Bases de Datos',
    icon: <Database size={28} />,
    skills: ['Java', 'C#', 'PHP', 'Spring Boot', 'MySQL'],
  },
  {
    title: 'RPA, Cloud y DevOps',
    icon: <Cloud size={28} />,
    skills: ['UiPath', 'Blue Prism', 'Camunda', 'Docker', 'AWS', 'Git'],
  },
  {
    title: 'Sistemas y Redes',
    icon: <Monitor size={28} />,
    skills: ['Administración de Servidores', 'Despliegue de Redes', 'Configuración Hardware/Software', 'Soporte Técnico'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const iconVariants: any = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Skills = () => {
  return (
    <section id="skills" className="py-24 relative bg-kh-bg-secondary transition-colors duration-300">

      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[5%] w-[420px] h-[420px] bg-accent-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%]  w-[420px] h-[420px] bg-blue-500/5  rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div
          className="mb-16 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-kh-text flex items-center justify-center gap-4">
            Habilidades Técnicas
          </h2>
          <p className="text-lg text-kh-muted mt-4 max-w-2xl mx-auto">
            Tecnologías con las que trabajo a diario — del frontend al servidor, de la automatización a la infraestructura.
          </p>
        </motion.div>

        {/* 2-column category grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-kh-bg-card backdrop-blur-md border border-kh-border rounded-3xl p-8 hover:border-accent-500/40 dark:hover:border-accent-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-accent-500/5 dark:hover:shadow-accent-500/10 relative overflow-hidden group"
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.03] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card header */}
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2.5 bg-accent-500/10 dark:bg-accent-500/15 rounded-xl text-accent-500 dark:text-accent-400">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-kh-text">{category.title}</h3>
              </div>

              {/* Icon grid */}
              <motion.div
                className="grid grid-cols-3 sm:grid-cols-4 gap-4 relative z-10"
                variants={containerVariants}
              >
                {category.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skillIdx}
                    variants={iconVariants}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.08,
                      boxShadow: `0 10px 25px -5px ${skillHexColors[skill]}35, 0 8px 10px -6px ${skillHexColors[skill]}20`,
                      borderColor: `${skillHexColors[skill]}50`
                    }}
                    onMouseEnter={() => magicalSynth.playChime()}
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-kh-bg-primary/40 border border-kh-border hover:bg-kh-bg-card hover:shadow-lg transition-all duration-200 cursor-default group/icon"
                  >
                    {/* Icon */}
                    <span
                      className={`text-4xl transition-transform duration-200 group-hover/icon:scale-110 ${skillColors[skill] ?? 'text-accent-500'}`}
                    >
                      {skillIcons[skill]}
                    </span>
                    {/* Name */}
                    <span className="text-[11px] font-semibold text-center text-kh-text leading-tight">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Skills;
