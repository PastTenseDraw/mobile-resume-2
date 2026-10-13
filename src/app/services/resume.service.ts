import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  PersonalProfile,
  CompanyRecord,
  SkillCategory,
  CertificationAward,
  ExperienceCard,
  BlogPost,
} from '../models/resume.model';
import {
  parseProfileMarkdown,
  parsePlacesWorkedMarkdown,
  parseSkillsMarkdown,
  parseCertificationsMarkdown,
  parseExperienceMarkdown,
  parseBlogPostMarkdown,
} from '../utils/markdown-parser';

export interface ContentManifest {
  profile: string;
  placesWorked: string;
  skills: string;
  certifications: string;
  experiences: string[];
  blogs: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private readonly http = inject(HttpClient);

  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  // Angular Signals for UI data
  readonly profile = signal<PersonalProfile>({
    name: 'Alexander R. Morgan',
    roleTitle: 'Staff Mobile & Frontend Architect',
    location: 'San Francisco, CA (Open to Remote / Hybrid)',
    statusBadge: 'Available for Select Opportunities',
    email: 'alex.morgan.eng@gmail.com',
    github: 'github.com/alex-morgan-dev',
    linkedin: 'linkedin.com/in/alex-morgan-mobile',
    phone: '+1 (415) 890-3421',
    summaryLead:
      'Architecting resilient cross-platform mobile ecosystems, micro-frontends, and performance-first distributed client systems.',
    summaryBody:
      'With over 9 years of hands-on engineering experience spanning Ionic, Angular, Capacitor, React Native, and native iOS/Android toolchains...',
    specializations: [
      'Cross-Platform Hybrid Architecture (Ionic / Capacitor)',
      'Enterprise Angular (Signals, Zoneless, Hydration, Micro-frontends)',
    ],
  });

  readonly placesWorked = signal<CompanyRecord[]>([]);
  readonly skills = signal<SkillCategory[]>([]);
  readonly certificationsAwards = signal<CertificationAward[]>([]);
  readonly experiences = signal<ExperienceCard[]>([]);
  readonly blogPosts = signal<BlogPost[]>([]);

  constructor() {
    this.loadAllMarkdownContent();
  }

  async loadAllMarkdownContent() {
    this.isLoading.set(true);
    this.loadError.set(null);

    try {
      // 1. Fetch the manifest
      const manifest = await this.fetchJson<ContentManifest>('assets/content/manifest.json');

      // 2. Fetch Profile markdown
      const profileMd = await this.fetchText(manifest.profile);
      this.profile.set(parseProfileMarkdown(profileMd));

      // 3. Fetch Places Worked markdown
      const placesMd = await this.fetchText(manifest.placesWorked);
      this.placesWorked.set(parsePlacesWorkedMarkdown(placesMd));

      // 4. Fetch Skills markdown
      const skillsMd = await this.fetchText(manifest.skills);
      this.skills.set(parseSkillsMarkdown(skillsMd));

      // 5. Fetch Certifications & Awards markdown
      const certsMd = await this.fetchText(manifest.certifications);
      this.certificationsAwards.set(parseCertificationsMarkdown(certsMd));

      // 6. Fetch all Experience markdown files
      const expPromises = manifest.experiences.map((path) => this.fetchText(path));
      const expMarkdownList = await Promise.all(expPromises);
      const parsedExperiences = expMarkdownList.map((md) => parseExperienceMarkdown(md));
      this.experiences.set(parsedExperiences);

      // 7. Fetch all Blog markdown files
      const blogPromises = manifest.blogs.map((path) => this.fetchText(path));
      const blogMarkdownList = await Promise.all(blogPromises);
      const parsedBlogs = blogMarkdownList.map((md) => parseBlogPostMarkdown(md));

      // Merge with any user-created blog entries from local storage
      const localCustomPosts = this.loadLocalCustomPosts();
      this.blogPosts.set([...localCustomPosts, ...parsedBlogs]);
    } catch (err: unknown) {
      console.warn('Error loading markdown content files:', err);
      this.loadError.set(err instanceof Error ? err.message : 'Unknown load error');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async fetchText(url: string): Promise<string> {
    try {
      return await firstValueFrom(this.http.get(url, { responseType: 'text' }));
    } catch {
      // Fallback to native fetch if HttpClient has asset route nuances
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch markdown file: ${url} (status: ${res.status})`);
      }
      return await res.text();
    }
  }

  private async fetchJson<T>(url: string): Promise<T> {
    try {
      return await firstValueFrom(this.http.get<T>(url));
    } catch {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch manifest: ${url} (status: ${res.status})`);
      }
      return (await res.json()) as T;
    }
  }

  private loadLocalCustomPosts(): BlogPost[] {
    try {
      const stored = localStorage.getItem('mobile_resume_local_posts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage error
    }
    return [];
  }

  addBlogPost(newPost: Omit<BlogPost, 'id' | 'date'>) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());

    const post: BlogPost = {
      ...newPost,
      id: 'local-post-' + Date.now(),
      date: formattedDate,
    };

    const currentLocal = this.loadLocalCustomPosts();
    const updatedLocal = [post, ...currentLocal];

    try {
      localStorage.setItem('mobile_resume_local_posts', JSON.stringify(updatedLocal));
    } catch {
      // Ignore storage quota error
    }

    this.blogPosts.set([post, ...this.blogPosts()]);
  }
}
