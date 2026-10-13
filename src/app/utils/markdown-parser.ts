import {
  PersonalProfile,
  CompanyRecord,
  SkillCategory,
  CertificationAward,
  ExperienceCard,
  BlogPost,
} from '../models/resume.model';

export interface ParsedFrontmatter {
  attributes: Record<string, string>;
  body: string;
}

export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  const trimmed = markdown.trim();
  if (!trimmed.startsWith('---')) {
    return { attributes: {}, body: trimmed };
  }

  const endIndex = trimmed.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { attributes: {}, body: trimmed };
  }

  const frontmatterStr = trimmed.slice(3, endIndex).trim();
  const body = trimmed.slice(endIndex + 4).trim();

  const attributes: Record<string, string> = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      attributes[key] = value;
    }
  }

  return { attributes, body };
}

export function parseProfileMarkdown(markdown: string): PersonalProfile {
  const { attributes, body } = parseFrontmatter(markdown);

  const sections = body.split(/##\s+/);
  const mainSummary = sections[0].trim();

  const specializations: string[] = [];
  if (sections.length > 1) {
    const specLines = sections[1].split('\n');
    for (const line of specLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        specializations.push(trimmed.replace(/^[-*]\s*/, '').trim());
      }
    }
  }

  return {
    name: attributes['name'] || 'Drew Baker',
    roleTitle: attributes['roleTitle'] || 'Senior Software Engineer',
    location: attributes['location'] || 'DFW',
    statusBadge: attributes['statusBadge'] || 'Available for Select Opportunities',
    email: attributes['email'] || '',
    github: attributes['github'] || '',
    linkedin: attributes['linkedin'] || '',
    phone: attributes['phone'] || '',
    summaryLead: attributes['summaryLead'] || '',
    summaryBody: mainSummary,
    specializations:
      specializations.length > 0
        ? specializations
        : [
            'Cross-Platform Hybrid Architecture (Ionic / Capacitor)',
            'Enterprise Angular (Signals, Zoneless, Hydration, Micro-frontends)',
          ],
  };
}

export function parsePlacesWorkedMarkdown(markdown: string): CompanyRecord[] {
  const lines = markdown.split('\n');
  const records: CompanyRecord[] = [];
  let idCounter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.replace(/^[-*]\s*/, '');
      const parts = content.split('|').map((p) => p.trim());
      if (parts.length >= 4) {
        const name = parts[0].replace(/\*\*/g, '').trim();
        const role = parts[1];
        const tenure = parts[2];
        const location = parts[3];
        const isCurrent =
          parts.length >= 5 && parts[4].toLowerCase().includes('current');

        records.push({
          id: `co-${idCounter++}`,
          name,
          role,
          tenure,
          location,
          isCurrent,
        });
      }
    }
  }

  return records;
}

export function parseSkillsMarkdown(markdown: string): SkillCategory[] {
  const lines = markdown.split('\n');
  const categories: SkillCategory[] = [];
  let currentCategory: SkillCategory | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      if (currentCategory && currentCategory.items.length > 0) {
        categories.push(currentCategory);
      }
      currentCategory = {
        category: trimmed.replace(/^##\s+/, '').trim(),
        items: [],
      };
    } else if (currentCategory && (trimmed.startsWith('- [') || trimmed.startsWith('* ['))) {
      const isHighlighted = trimmed.includes('[x]') || trimmed.includes('[X]');
      const skillName = trimmed.replace(/^[-*]\s*\[[ xX]\]\s*/, '').trim();

      if (skillName) {
        currentCategory.items.push({
          name: skillName,
          isHighlighted,
        });
      }
    }
  }

  if (currentCategory && currentCategory.items.length > 0) {
    categories.push(currentCategory);
  }

  return categories;
}

export function parseCertificationsMarkdown(markdown: string): CertificationAward[] {
  const lines = markdown.split('\n');
  const results: CertificationAward[] = [];
  let currentItem: Partial<CertificationAward> | null = null;
  let idCounter = 1;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('- [') || trimmed.startsWith('* [')) {
      if (currentItem && currentItem.title) {
        results.push(currentItem as CertificationAward);
      }

      const isHighlighted = trimmed.includes('[x]') || trimmed.includes('[X]');
      const titleMatch = trimmed.match(/\*\*(.*?)\*\*/);
      const title = titleMatch ? titleMatch[1] : trimmed.replace(/^[-*]\s*\[[ xX]\]\s*/, '');

      currentItem = {
        id: `cert-${idCounter++}`,
        title,
        isHighlighted,
        type: 'certification',
        issuer: '',
        year: '',
      };
    } else if (currentItem) {
      if (trimmed.toLowerCase().startsWith('- type:')) {
        const val = trimmed.slice(7).trim().toLowerCase();
        currentItem.type = val.includes('award') ? 'award' : 'certification';
      } else if (trimmed.toLowerCase().startsWith('- issuer:')) {
        currentItem.issuer = trimmed.slice(9).trim();
      } else if (trimmed.toLowerCase().startsWith('- year:')) {
        currentItem.year = trimmed.slice(7).trim();
      } else if (trimmed.toLowerCase().startsWith('- credential:')) {
        currentItem.credentialId = trimmed.slice(13).trim();
      } else if (trimmed.toLowerCase().startsWith('- description:')) {
        currentItem.description = trimmed.slice(14).trim();
      }
    }
  }

  if (currentItem && currentItem.title) {
    results.push(currentItem as CertificationAward);
  }

  return results;
}

export function parseExperienceMarkdown(markdown: string): ExperienceCard {
  const { attributes, body } = parseFrontmatter(markdown);

  const bullets: string[] = [];
  const lines = body.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      bullets.push(trimmed.replace(/^[-*]\s*/, '').trim());
    }
  }

  const techList = attributes['technologies']
    ? attributes['technologies'].split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    id: attributes['id'] || `exp-${Date.now()}`,
    company: attributes['company'] || 'Company',
    role: attributes['role'] || 'Software Engineer',
    period: attributes['period'] || '2020 - 2021',
    location: attributes['location'] || 'Remote',
    isCurrent: attributes['isCurrent'] === 'true',
    highlightMetric: attributes['highlightMetric'] || undefined,
    technologies: techList,
    blurb: bullets,
  };
}

export function parseBlogPostMarkdown(markdown: string): BlogPost {
  const { attributes, body } = parseFrontmatter(markdown);

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const tags = attributes['tags']
    ? attributes['tags'].split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
    : [];

  return {
    id: attributes['id'] || `post-${Date.now()}`,
    title: attributes['title'] || 'Untitled Dispatch',
    date: attributes['date'] || 'Oct 2026',
    readTime: attributes['readTime'] || '4 min read',
    category: attributes['category'] || 'Engineering',
    excerpt: attributes['excerpt'] || paragraphs[0]?.slice(0, 160) + '...' || '',
    content: paragraphs,
    tags: tags.length > 0 ? tags : ['Engineering'],
    isFeatured: attributes['isFeatured'] === 'true',
  };
}
