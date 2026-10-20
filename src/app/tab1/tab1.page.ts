import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonToast,
} from '@ionic/angular';
import { ResumeService } from '../services/resume.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonToast,
  ],
})
export class Tab1Page {
  readonly resumeService = inject(ResumeService);
  private readonly analytics = inject(AnalyticsService);

  toastMessage = '';
  isToastOpen = false;

  copyContact(text: string, label: string) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      this.toastMessage = `Copied ${label} to clipboard: ${text}`;
      this.isToastOpen = true;
    }
    this.analytics.trackContactClick('email', text);
  }

  onContactClick(channel: 'github' | 'linkedin' | 'phone', value?: string) {
    this.analytics.trackContactClick(channel, value);
  }

  onResumeDownload() {
    this.analytics.trackResumeDownload();
  }
}
