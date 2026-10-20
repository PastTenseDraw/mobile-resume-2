import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly router = inject(Router);

  private app: FirebaseApp | null = null;
  private analytics: Analytics | null = null;
  private isInitialized = false;

  constructor() {
    this.initFirebase();
  }

  private async initFirebase(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      if (!environment.firebase?.apiKey) {
        return;
      }

      // Initialize Firebase App if not already initialized
      if (!getApps().length) {
        this.app = initializeApp(environment.firebase);
      } else {
        this.app = getApps()[0];
      }

      // Check if Analytics is supported in current environment
      const supported = await isSupported();
      if (supported && this.app) {
        this.analytics = getAnalytics(this.app);
        this.isInitialized = true;

        // Start automatic route / page view tracking
        this.listenToRouteChanges();

        // Log initial page view
        this.logPageView(document.title, window.location.pathname);
      }
    } catch (err) {
      console.warn('[Analytics] Failed to initialize Firebase Analytics:', err);
    }
  }

  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.logPageView(document.title, event.urlAfterRedirects);
      });
  }

  /**
   * Log a standard or custom Firebase event
   */
  logEvent(eventName: string, eventParams?: Record<string, any>): void {
    if (this.isInitialized && this.analytics) {
      try {
        logEvent(this.analytics, eventName, eventParams);
      } catch (err) {
        console.warn(`[Analytics] Error logging event "${eventName}":`, err);
      }
    }
  }

  /**
   * Log a page_view event with path and title
   */
  logPageView(pageTitle?: string, pagePath?: string): void {
    const path = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '');
    const title = pageTitle || (typeof window !== 'undefined' ? document.title : '');

    this.logEvent('page_view', {
      page_title: title,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path: path,
    });
  }

  /**
   * Track when visitor downloads or views resume PDF
   */
  trackResumeDownload(fileName: string = 'Drew_Baker_Resume_2026.pdf'): void {
    this.logEvent('resume_download', {
      file_name: fileName,
      file_type: 'pdf',
    });
  }

  /**
   * Track clicks on contact links (email, phone, github, linkedin)
   */
  trackContactClick(channel: 'email' | 'phone' | 'github' | 'linkedin', value?: string): void {
    this.logEvent('contact_click', {
      contact_channel: channel,
      contact_value: value || '',
    });
  }

  /**
   * Track when a blog dispatch is opened in reader
   */
  trackBlogRead(postId: string, postTitle: string, category: string): void {
    this.logEvent('blog_article_view', {
      post_id: postId,
      post_title: postTitle,
      category,
    });
  }

  /**
   * Track role filter changes in experience section
   */
  trackExperienceFilter(filterName: string): void {
    this.logEvent('experience_filter', {
      filter: filterName,
    });
  }
}
