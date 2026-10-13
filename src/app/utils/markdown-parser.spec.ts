import { describe, it, expect } from 'vitest';
import {
  parseFrontmatter,
  parseProfileMarkdown,
  parsePlacesWorkedMarkdown,
  parseSkillsMarkdown,
  parseCertificationsMarkdown,
  parseExperienceMarkdown,
  parseBlogPostMarkdown,
} from './markdown-parser';

describe('Markdown Parser', () => {
  it('should parse frontmatter attributes and body', () => {
    const raw = `---
name: Jane Doe
role: Architect
---
Here is the body content.`;

    const result = parseFrontmatter(raw);
    expect(result.attributes['name']).toBe('Jane Doe');
    expect(result.attributes['role']).toBe('Architect');
    expect(result.body).toBe('Here is the body content.');
  });

  it('should parse profile markdown including specializations', () => {
    const profileMd = `---
name: Jane Doe
roleTitle: Lead Engineer
location: Austin, TX
statusBadge: Active
email: jane@example.com
summaryLead: Building great software.
---
Main summary paragraph here.

## Core Specializations
- Mobile Systems
- Cloud Architecture`;

    const profile = parseProfileMarkdown(profileMd);
    expect(profile.name).toBe('Jane Doe');
    expect(profile.summaryBody).toBe('Main summary paragraph here.');
    expect(profile.specializations).toEqual(['Mobile Systems', 'Cloud Architecture']);
  });

  it('should parse places worked list', () => {
    const placesMd = `# Places I've Worked
- **Acme Corp** | Principal Engineer | 2021 - Present | San Francisco | current: true
- **Beta LLC** | Senior Developer | 2018 - 2021 | Remote`;

    const places = parsePlacesWorkedMarkdown(placesMd);
    expect(places.length).toBe(2);
    expect(places[0].name).toBe('Acme Corp');
    expect(places[0].isCurrent).toBe(true);
    expect(places[1].name).toBe('Beta LLC');
    expect(places[1].isCurrent).toBe(false);
  });

  it('should parse skills markdown with highlighted tags', () => {
    const skillsMd = `# Skills
## Mobile
- [x] Ionic 9
- [ ] React Native`;

    const skills = parseSkillsMarkdown(skillsMd);
    expect(skills.length).toBe(1);
    expect(skills[0].category).toBe('Mobile');
    expect(skills[0].items[0]).toEqual({ name: 'Ionic 9', isHighlighted: true });
    expect(skills[0].items[1]).toEqual({ name: 'React Native', isHighlighted: false });
  });

  it('should parse experience card markdown', () => {
    const expMd = `---
company: Apex Systems
role: Staff Engineer
period: Jan 2020 - Feb 2021
location: New York, NY
isCurrent: false
highlightMetric: 3x Speedup
technologies: Ionic, Angular, TypeScript
---
- Designed the new client gateway.
- Migrated legacy data pipeline.`;

    const exp = parseExperienceMarkdown(expMd);
    expect(exp.company).toBe('Apex Systems');
    expect(exp.highlightMetric).toBe('3x Speedup');
    expect(exp.technologies).toEqual(['Ionic', 'Angular', 'TypeScript']);
    expect(exp.blurb.length).toBe(2);
  });

  it('should parse blog post markdown', () => {
    const blogMd = `---
title: Editorial UI
date: Oct 2026
readTime: 3 min read
category: Design
isFeatured: true
tags: UI, Mobile
excerpt: Short summary
---
First paragraph.

Second paragraph.`;

    const blog = parseBlogPostMarkdown(blogMd);
    expect(blog.title).toBe('Editorial UI');
    expect(blog.isFeatured).toBe(true);
    expect(blog.tags).toEqual(['UI', 'Mobile']);
    expect(blog.content.length).toBe(2);
  });
});
