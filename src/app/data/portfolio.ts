/**
 * Contenido del portafolio.
 *
 * - Los textos visibles son claves de traducción: su texto vive en public/i18n/es.json y public/i18n/en.json.
 * - Las rutas de imágenes y CV son relativas a public/ (por ejemplo, media/projects/beatride-platform-1.png).
 * - Los proyectos se muestran en el orden de este archivo. Uno con featured: true ocupa todo el ancho.
 * - Los nombres de skills de un proyecto deben coincidir con los de skillCategories.
 */

export interface Link {
  name: string;
  nick: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Experience {
  company: string;
  company_url?: string;
  role_key: string;
  duration_key: string;
  location_key: string;
  description_key: string;
  bullets_keys: string[];
  stack: string[];
  is_current: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  company?: string;
  companyUrl?: string;
  images?: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  additional_info?: string;
  skills?: string[];
}

export const cvUrl: Record<string, string> = {
  es: 'cv/ESP_HV_Andres_Uribe_Garcia_2026.pdf',
  en: 'cv/ENG_HV_Andres_Uribe_Garcia_2026.pdf'
};

export const socialNetworks: Link[] = [
  {
    name: 'LinkedIn',
    nick: 'andresfuribeg',
    url: 'https://www.linkedin.com/in/andresfuribeg/',
    icon: 'media/social/linkedin.svg'
  },
  {
    name: 'GitHub',
    nick: 'LotusZaheer',
    url: 'https://github.com/LotusZaheer',
    icon: 'media/social/github.png'
  }
];

export const contactMethods: Link[] = [
  {
    name: 'LinkedIn',
    nick: 'andresfuribeg',
    url: 'https://www.linkedin.com/in/andresfuribeg/',
    icon: 'media/contact/linkedin.svg'
  },
  {
    name: 'Email',
    nick: 'andresfelipeuribe11@gmail.com',
    url: 'mailto:andresfelipeuribe11@gmail.com',
    icon: 'media/contact/email.svg'
  },
  {
    name: 'WhatsApp',
    nick: 'WhatsApp',
    url: 'https://wa.me/573016561380',
    icon: 'media/contact/whatsapp.svg'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'skills.categories.languages',
    skills: [
      {
        name: 'C++',
        icon: 'media/skills/cpp.svg'
      },
      {
        name: 'JavaScript',
        icon: 'media/skills/javascript.png'
      },
      {
        name: 'Python',
        icon: 'media/skills/python.svg'
      },
      {
        name: 'TypeScript',
        icon: 'media/skills/typescript.svg'
      }
    ]
  },
  {
    name: 'skills.categories.frameworks',
    skills: [
      {
        name: 'Angular',
        icon: 'media/skills/angular.svg'
      },
      {
        name: 'React',
        icon: 'media/skills/react.png'
      }
    ]
  },
  {
    name: 'skills.categories.markup',
    skills: [
      {
        name: 'CSS',
        icon: 'media/skills/css.webp'
      },
      {
        name: 'HTML',
        icon: 'media/skills/html.png'
      },
      {
        name: 'SCSS',
        icon: 'media/skills/scss.png'
      }
    ]
  },
  {
    name: 'skills.categories.libraries',
    skills: [
      {
        name: 'GeoPandas',
        icon: 'media/skills/geopandas.webp'
      },
      {
        name: 'Numpy',
        icon: 'media/skills/numpy.svg'
      },
      {
        name: 'OR-Tools',
        icon: 'media/skills/or-tools.png'
      },
      {
        name: 'Pandas',
        icon: 'media/skills/pandas.svg'
      },
      {
        name: 'Pyomo',
        icon: 'media/skills/pyomo.png'
      },
      {
        name: 'RxJS',
        icon: 'media/skills/rxjs.png'
      },
      {
        name: 'Scipy',
        icon: 'media/skills/scipy.svg'
      }
    ]
  },
  {
    name: 'skills.categories.platforms',
    skills: [
      {
        name: 'Docker',
        icon: 'media/skills/docker.png'
      }
    ]
  },
  {
    name: 'skills.categories.apis',
    skills: [
      {
        name: 'Google Maps',
        icon: 'media/skills/google-maps.svg'
      },
      {
        name: 'OpenStreetMap',
        icon: 'media/skills/openstreetmap.svg'
      }
    ]
  },
  {
    name: 'skills.categories.tools',
    skills: [
      {
        name: 'i18n'
      },
      {
        name: 'Vite',
        icon: 'media/skills/vite.png'
      }
    ]
  },
  {
    name: 'skills.categories.cicd',
    skills: [
      {
        name: 'GitHub Actions',
        icon: 'media/skills/github-actions.png'
      }
    ]
  }
];

export const experiences: Experience[] = [
  {
    company: 'OrusXpert SAS',
    role_key: 'experience.items.orusxpert.role',
    duration_key: 'experience.items.orusxpert.duration',
    location_key: 'experience.items.orusxpert.location',
    description_key: 'experience.items.orusxpert.description',
    bullets_keys: [
      'experience.items.orusxpert.bullet1',
      'experience.items.orusxpert.bullet2',
      'experience.items.orusxpert.bullet3',
      'experience.items.orusxpert.bullet4'
    ],
    stack: ['Angular', 'Python', 'C++', 'GeoPandas', 'SciPy', 'React', 'Docker'],
    is_current: false
  }
];

export const projects: Project[] = [
  {
    id: 'beatridePlatform',
    title: 'projects.items.beatridePlatform.title',
    description: 'projects.items.beatridePlatform.description',
    role: 'projects.items.beatridePlatform.role',
    company: 'OrusXpert',
    companyUrl: 'https://orusxpert.co/home',
    images: ['media/projects/beatride-platform-1.png'],
    liveUrl: 'https://platform.beatride.co/',
    featured: true,
    additional_info: 'projects.items.beatridePlatform.details',
    skills: [
      'Python',
      'C++',
      'TypeScript',
      'Angular',
      'HTML',
      'SCSS',
      'RxJS',
      'Numpy',
      'Pandas',
      'GeoPandas',
      'Scipy',
      'Pyomo',
      'OR-Tools',
      'Docker',
      'Google Maps',
      'OpenStreetMap'
    ]
  },
  {
    id: 'beatrideLanding',
    title: 'projects.items.beatrideLanding.title',
    description: 'projects.items.beatrideLanding.description',
    role: 'projects.items.beatrideLanding.role',
    company: 'OrusXpert',
    companyUrl: 'https://orusxpert.co/',
    images: ['media/projects/beatride-landing-1.jpeg'],
    liveUrl: 'https://beatride.co/',
    additional_info: 'projects.items.beatrideLanding.details',
    skills: ['React', 'JavaScript', 'SCSS', 'Docker']
  }
];
