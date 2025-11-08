"use client"

export const languages = {
  es: "Español",
  en: "English",
} as const

export type Language = keyof typeof languages

export const translations = {
  es: {
    // Navegación
    nav: {
      home: "Inicio",
      anime: "Anime",
      tools: "Herramientas",
      minecraft: "Minecraft",
      experience: "Experiencia",
      projects: "Proyectos",
      contact: "Contacto",
    },
    // Hero
    hero: {
      title: "Hiroshi025",
      subtitle: "Desarrollador | Backend y Microcontroladores",
      description: "Creo soluciones digitales innovadoras con tecnologías modernas y código limpio.",
      viewProjects: "Ver mis proyectos",
      contact: "Contacto",
      animation: "Animación",
    },
    // Sobre mí
    about: {
      title: "Sobre Mí",
      description1:
        "Soy un desarrollador backend con más de 3 años de experiencia creando aplicaciones web modernas. Me especializo en C++, TypeScript y el ecosistema React/NestJS.",
      description2:
        "Mi pasión por la programación comenzó cuando descubrí cómo crear mis propias soluciones tecnológicas. Desde entonces, he trabajado en diversos proyectos, desde pequeñas aplicaciones hasta sistemas complejos, siempre buscando aprender y mejorar mis habilidades.",
      badges: {
        developer: "Backend Developer",
        projects: "+20 Proyectos",
        contributor: "Open Source Contributor",
      },
    },
    // Estadísticas
    stats: {
      repos: "Repositorios Públicos",
      stars: "Stars en GitHub",
      forks: "Forks Totales",
      technologies: "Tecnologías Dominadas",
    },
    // Habilidades
    skills: {
      title: "Mis Habilidades",
      mainTech: "Tecnologías Principales",
      otherTech: "Otras Tecnologías",
      languages: "Idiomas",
      spanish: "Español",
      english: "Inglés",
      native: "Nativo",
      basic: "Básico (A2)",
    },
    // Proyectos
    projects: {
      title: "Mis Proyectos",
      featured: "Proyectos Principales",
      distribution: "Distribución de Lenguajes",
      tabs: {
        featured: "Destacados",
        recent: "Recientes",
      },
      actions: {
        viewDetails: "Ver Detalles",
        github: "GitHub",
        website: "Sitio Web",
      },
      details: {
        stars: "Stars",
        forks: "Forks",
        watchers: "Watchers",
        issues: "Issues",
        technologies: "Tecnologías Utilizadas",
        contributors: "Colaboradores",
        created: "Creado",
        updated: "Última actualización",
        license: "Licencia",
        topics: "Topics",
        commits: "commits",
      },
    },
    // Experiencia
    experience: {
      title: "Trayectoria Profesional",
      description:
        "Mi camino en el desarrollo de software, desde los primeros pasos hasta los proyectos más complejos.",
      cta: {
        title: "¿Listo para trabajar juntos?",
        description: "Tengo experiencia creando soluciones digitales a medida. Contáctame para discutir tu proyecto.",
        button: "Contactar Ahora",
      },
    },
    // Stack
    stack: {
      title: "Mi Stack Favorito",
      description:
        "Mi stack favorito combina la potencia de Python y C++ para lógica avanzada y automatización, junto con TypeScript y NestJS para construir APIs robustas y escalables con arquitectura modular. Utilizo Prisma como ORM moderno para bases de datos, logrando así soluciones eficientes, seguras y de alto rendimiento.",
    },
    // Contacto
    contact: {
      title: "Contacto",
      description: "¿Interesado en trabajar juntos o tienes alguna pregunta? No dudes en contactarme.",
      discord: {
        title: "Discord - Principal forma de contacto",
        description: "Encuéntrame en Discord para una respuesta rápida:",
      },
      schedule: "Horario de respuesta:",
      scheduleTime: "Lunes a Viernes, 9:00 - 18:00 (GMT-5)",
      downloadCV: "Descargar CV",
    },
    // Footer
    footer: {
      rights: "Todos los derechos reservados.",
    },
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      anime: "Anime",
      tools: "Tools",
      minecraft: "Minecraft",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
    },
    // Hero
    hero: {
      title: "Hiroshi025",
      subtitle: "Developer | Backend and Microcontrollers",
      description: "I create innovative digital solutions with modern technologies and clean code.",
      viewProjects: "View my projects",
      contact: "Contact",
      animation: "Animation",
    },
    // About
    about: {
      title: "About Me",
      description1:
        "I am a backend developer with over 3 years of experience creating modern web applications. I specialize in C++, TypeScript and the React/NestJS ecosystem.",
      description2:
        "My passion for programming began when I discovered how to create my own technological solutions. Since then, I have worked on various projects, from small applications to complex systems, always seeking to learn and improve my skills.",
      badges: {
        developer: "Backend Developer",
        projects: "+20 Projects",
        contributor: "Open Source Contributor",
      },
    },
    // Stats
    stats: {
      repos: "Public Repositories",
      stars: "GitHub Stars",
      forks: "Total Forks",
      technologies: "Mastered Technologies",
    },
    // Skills
    skills: {
      title: "My Skills",
      mainTech: "Main Technologies",
      otherTech: "Other Technologies",
      languages: "Languages",
      spanish: "Spanish",
      english: "English",
      native: "Native",
      basic: "Basic (A2)",
    },
    // Projects
    projects: {
      title: "My Projects",
      featured: "Main Projects",
      distribution: "Language Distribution",
      tabs: {
        featured: "Featured",
        recent: "Recent",
      },
      actions: {
        viewDetails: "View Details",
        github: "GitHub",
        website: "Website",
      },
      details: {
        stars: "Stars",
        forks: "Forks",
        watchers: "Watchers",
        issues: "Issues",
        technologies: "Technologies Used",
        contributors: "Contributors",
        created: "Created",
        updated: "Last updated",
        license: "License",
        topics: "Topics",
        commits: "commits",
      },
    },
    // Experience
    experience: {
      title: "Professional Journey",
      description: "My path in software development, from first steps to the most complex projects.",
      cta: {
        title: "Ready to work together?",
        description: "I have experience creating custom digital solutions. Contact me to discuss your project.",
        button: "Contact Now",
      },
    },
    // Stack
    stack: {
      title: "My Favorite Stack",
      description:
        "My favorite stack combines the power of Python and C++ for advanced logic and automation, along with TypeScript and NestJS to build robust and scalable APIs with modular architecture. I use Prisma as a modern ORM for databases, achieving efficient, secure and high-performance solutions.",
    },
    // Contact
    contact: {
      title: "Contact",
      description: "Interested in working together or have any questions? Feel free to contact me.",
      discord: {
        title: "Discord - Main contact method",
        description: "Find me on Discord for a quick response:",
      },
      schedule: "Response time:",
      scheduleTime: "Monday to Friday, 9:00 - 18:00 (GMT-5)",
      downloadCV: "Download CV",
    },
    // Footer
    footer: {
      rights: "All rights reserved.",
    },
  },
}

export function useTranslations(lang: Language) {
  return translations[lang]
}
