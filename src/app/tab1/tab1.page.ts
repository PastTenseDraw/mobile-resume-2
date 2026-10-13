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

  toastMessage = '';
  isToastOpen = false;

  copyContact(text: string, label: string) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      this.toastMessage = `Copied ${label} to clipboard: ${text}`;
      this.isToastOpen = true;
    }
  }
}
