import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonToast,
} from '@ionic/angular';
import { ResumeService } from '../services/resume.service';
import { AnalyticsService } from '../services/analytics.service';
import { BlogPost } from '../models/resume.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    IonToast,
  ],
})
export class Tab3Page {
  readonly resumeService = inject(ResumeService);
  private readonly analytics = inject(AnalyticsService);

  readonly selectedCategory = signal<string>('All');
  readonly activePost = signal<BlogPost | null>(null);
  readonly isReaderOpen = signal<boolean>(false);
  readonly isComposeOpen = signal<boolean>(false);

  // New post form fields
  newTitle = '';
  newCategory = 'Architecture';
  newExcerpt = '';
  newContent = '';
  newTags = '';
  newIsFeatured = false;

  toastMessage = '';
  isToastOpen = false;

  readonly categories = ['All', 'Architecture', 'Design Systems', 'Mobile Engineering'];

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  get filteredPosts(): BlogPost[] {
    const list = this.resumeService.blogPosts();
    const cat = this.selectedCategory();
    if (cat === 'All') {
      return list;
    }
    return list.filter((p) => p.category.toLowerCase() === cat.toLowerCase());
  }

  openReader(post: BlogPost) {
    this.activePost.set(post);
    this.isReaderOpen.set(true);
    this.analytics.trackBlogRead(post.id, post.title, post.category);
  }

  closeReader() {
    this.isReaderOpen.set(false);
    this.activePost.set(null);
  }

  openCompose() {
    this.newTitle = '';
    this.newCategory = 'Architecture';
    this.newExcerpt = '';
    this.newContent = '';
    this.newTags = '';
    this.newIsFeatured = false;
    this.isComposeOpen.set(true);
  }

  closeCompose() {
    this.isComposeOpen.set(false);
  }

  publishPost() {
    if (!this.newTitle.trim()) {
      this.toastMessage = 'Please enter an entry title';
      this.isToastOpen = true;
      return;
    }

    if (!this.newContent.trim()) {
      this.toastMessage = 'Please write some entry content';
      this.isToastOpen = true;
      return;
    }

    const paragraphs = this.newContent
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tagList = this.newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const words = this.newContent.split(/\s+/).length;
    const estMinutes = Math.max(1, Math.ceil(words / 150));

    this.resumeService.addBlogPost({
      title: this.newTitle.trim(),
      category: this.newCategory || 'General',
      excerpt: this.newExcerpt.trim() || paragraphs[0]?.slice(0, 160) + '...',
      content: paragraphs,
      readTime: `${estMinutes} min read`,
      tags: tagList.length > 0 ? tagList : ['Notes', this.newCategory],
      isFeatured: this.newIsFeatured,
    });

    this.isComposeOpen.set(false);
    this.toastMessage = 'Dispatched new entry to the journal!';
    this.isToastOpen = true;
  }
}
