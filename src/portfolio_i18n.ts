// src/portfolio_i18n.ts
export const portfolioTranslations = {
  fr: {
    title: "Mon Parcours Technique",
    description: "Mes expériences de développement et projets personnels/académiques.",
    experiencesTitle: "Expériences Techniques",
    projectsTitle: "Projets Techniques",
    certificationsTitle: "Certifications & Réalisations",
    experiences: [
      {
        title: "Application PWA de Gestion de Cantine",
        description: "Développement d'une application progressive pour la gestion de cantine scolaire avec fonctionnalités complètes.",
        detailedDescription: `Création d'une application PWA permettant de gérer les repas, commandes et paiements pour les cantines scolaires.  
Fonctionnalités clés : inscription des élèves, gestion des menus, notifications et statistiques en temps réel.`,
        technologies: ["NestJS", "Next.js", "TailwindCSS", "PostgreSQL"],
        icon: "🍽️",
        period: "Présent",
        images: [
	   "https://picsum.photos/800/600?random=1",
	   "/images/portfolio/cantine/test2.jpg",
	   "/images/portfolio/cantine/test1.jpg",
	   
	],
      },
      {
        title: "Module d'Organigramme Dynamique",
        description: "Plugin d'organigramme interactif intégré à un ERP existant avec visualisation hiérarchique.",
        technologies: ["Flask", "SQLite", "Angular 18"],
        icon: "📊",
        period: "2025"
      },
      {
        title: "Solution SIEM de Sécurité",
        description: "Implémentation d'une solution de détection et réponse aux menaces avec analyse centralisée des logs.",
        technologies: ["Graylog", "Snort", "Syslog", "The Hive", "Docker"],
        icon: "🛡️",
        period: "2024",
      },
      {
        title: "Développeur WordPress",
        description: "Création d'un site vitrine WordPress responsive pour présenter des produits/services avec design moderne et adaptatif.",
        technologies: ["WordPress", "CSS", "Responsive Design", "PHP"],
        icon: "🌐",
        company: "Projet Freelance",
        period: "2020"
      }
    ],
    projects: [
      {
        title: "Jeu de Cartes (Projet de Bachelor)",
        description: "Développement d'un jeu de cartes avec interface graphique complète comme projet de fin d'études.",
        technologies: ["Java", "Swing"],
        year: "2021"
      },
      {
        title: "Jeu Takuzu avec SAT Solver",
        description: "Implémentation du jeu logique Takuzu avec résolution automatique utilisant un SAT Solver.",
        technologies: ["Python", "SAT Solver", "OOP"],
        year: "2021"
      },
      {
        title: "Mini-Shell en C",
        description: "Réplique des fonctionnalités de base d'un shell Unix avec gestion des commandes et processus.",
        technologies: ["C", "Bash"],
        year: "2020"
      }
    ],
    certifications: [
      { name: "Hack The Box Challenges", year: "2022", level: "Plusieurs CTFs terminés" },
      { name: "TryHackMe Pathways", year: "2021", level: "Ingénieur Sécurité complété" },
      { name: "Projets Arduino", year: "2020", level: "Bateau Télécommandé" }
    ]
  },
  en: {
    title: "My Technical Journey",
    description: "My development experiences and personal/academic projects.",
    experiencesTitle: "Technical Experiences",
    projectsTitle: "Technical Projects",
    certificationsTitle: "Certifications & Achievements",
    experiences: [
      {
        title: "PWA Application for Canteen Management",
        description: "Development of a progressive app for school canteen management with full features.",
        technologies: ["NestJS", "Next.js", "TailwindCSS", "PostgreSQL"],
        icon: "🍽️",
        period: "Present",
      },
      {
        title: "Dynamic Org Chart Module",
        description: "Interactive org chart plugin integrated into an existing ERP with hierarchical view.",
        technologies: ["Flask", "SQLite", "Angular 18"],
        icon: "📊",
        period: "2025"
      },
      {
        title: "Security SIEM Solution",
        description: "Deployment of threat detection and response solution with centralized log analysis.",
        technologies: ["Graylog", "Snort", "Syslog", "The Hive", "Docker"],
        icon: "🛡️",
        period: "2024",
      },
      {
        title: "WordPress Developer",
        description: "Created a responsive WordPress showcase site with a modern adaptive design.",
        technologies: ["WordPress", "CSS", "Responsive Design", "PHP"],
        icon: "🌐",
        company: "Freelance Project",
        period: "2020"
      }
    ],
    projects: [
      {
        title: "Card Game (Bachelor Project)",
        description: "Development of a full GUI card game as a final-year project.",
        technologies: ["Java", "Swing"],
        year: "2021"
      },
      {
        title: "Takuzu Game with SAT Solver",
        description: "Implementation of the logic game Takuzu with auto-solving via SAT Solver.",
        technologies: ["Python", "SAT Solver", "OOP"],
        year: "2021"
      },
      {
        title: "Mini-Shell in C",
        description: "Basic Unix shell clone with command and process management.",
        technologies: ["C", "Bash"],
        year: "2020"
      }
    ],
    certifications: [
      { name: "Hack The Box Challenges", year: "2022", level: "Multiple CTFs completed" },
      { name: "TryHackMe Pathways", year: "2021", level: "Completed Security Engineer" },
      { name: "Arduino Projects", year: "2020", level: "RC Boat" }
    ]
  }
};
