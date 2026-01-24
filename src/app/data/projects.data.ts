export interface Project {
  id: number;
  title: string;
  description: string;
  frameworks?: string[];
  apis?: string[];
  libraries?: string[];
  platforms?: string[];
  languages?: string[];
  markupStyles?: string[];
  company?: string;
  companyUrl?: string;
  role: string;
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  currentImageIndex: number;
  progress: number;
}

export const projects: Project[] = [
  {
    id: 0,
    title: 'projects.beatride.title',
    description: 'projects.beatride.description',
    frameworks: ['Angular'],
    apis: ['Google Maps API'],
    libraries: ['OR-Tools', 'Pandas', 'GeoPandas', 'Numpy', 'Dask'],
    platforms: ['ESRI', 'Docker'],
    languages: ['Python', 'C++', 'TypeScript'],
    markupStyles: ['SCSS', 'HTML5'],
    company: 'OrusXpert SAS',
    companyUrl: 'https://orusxpert.co',
    role: 'projects.beatride.role',
    images: [
      './assets/images/projects/beatridemap-1.png',
      './assets/images/projects/beatridemap-2.png',
      './assets/images/projects/beatridemap-3.png',
      './assets/images/projects/beatridemap-4.png',
      './assets/images/projects/beatridemap-5.png',
      './assets/images/projects/beatridemap-6.png',
      './assets/images/projects/beatridemap-7.png',
      './assets/images/projects/beatridemap-8.png',
      './assets/images/projects/beatridemap-9.png',
      './assets/images/projects/beatridemap-10.png',
      './assets/images/projects/beatridemap-11.png',
      './assets/images/projects/beatridemap-12.png',
      './assets/images/projects/beatridemap-13.png',
      './assets/images/projects/beatridemap-14.png',
    ],
    liveUrl: 'https://beatride.co',
    featured: true,
    currentImageIndex: 0,
    progress: 0
  },

  {
    id: 1,
    title: 'projects.fampas.title',
    description: 'projects.fampas.description',
    frameworks: ['Angular'],
    platforms: ['Docker'],
    languages: ['TypeScript'],
    markupStyles: ['SCSS', 'HTML5'],
    company: 'OrusXpert SAS',
    companyUrl: 'https://orusxpert.co',
    role: 'projects.fampas.role',
    images: [
      './assets/images/projects/fundacionfampas.png',
    ],
    liveUrl: 'https://fundacionfampas.com/',
    featured: true,
    currentImageIndex: 0,
    progress: 0
  }
];