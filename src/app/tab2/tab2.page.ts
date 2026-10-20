import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { ResumeService } from '../services/resume.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
  ],
})
export class Tab2Page {
  readonly resumeService = inject(ResumeService);
  private readonly analytics = inject(AnalyticsService);

  readonly selectedFilter = signal<string>('all');

  filterRoles(filterName: string) {
    this.selectedFilter.set(filterName);
    this.analytics.trackExperienceFilter(filterName);
  }

  get filteredExperiences() {
    const list = this.resumeService.experiences();
    if (this.selectedFilter() === 'current') {
      return list.filter((e) => e.isCurrent);
    }
    return list;
  }
}
