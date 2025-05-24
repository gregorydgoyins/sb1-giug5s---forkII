export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
  };
  demoUrl?: string;
  githubUrl?: string;
  images: string[];
  role: string;
  achievements: string[];
  category: 'web' | 'mobile' | 'desktop' | 'other';
}