export interface PersonalProfile {
  name: string;
  roleTitle: string;
  location: string;
  statusBadge: string;
  email: string;
  github: string;
  linkedin: string;
  phone: string;
  resumeUrl?: string;
  summaryLead: string;
  summaryBody: string;
  specializations: string[];
}

export interface CompanyRecord {
  id: string;
  name: string;
  role: string;
  tenure: string;
  location: string;
  isCurrent?: boolean;
}

export interface SkillItem {
  name: string;
  isHighlighted?: boolean;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface CertificationAward {
  id: string;
  type: 'certification' | 'award';
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
  isHighlighted?: boolean;
  description?: string;
}

export interface ExperienceCard {
  id: string;
  company: string;
  role: string;
  period: string; // e.g. "Jan 2020 - Feb 2021"
  location: string;
  isCurrent?: boolean;
  blurb: string[];
  highlightMetric?: string;
  technologies: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string[];
  tags: string[];
  isFeatured?: boolean;
}
