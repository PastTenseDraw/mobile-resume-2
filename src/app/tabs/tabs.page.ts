import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  briefcaseOutline,
  readerOutline,
  newspaperOutline,
  documentTextOutline,
  calendarOutline,
  locationOutline,
  mailOutline,
  logoGithub,
  logoLinkedin,
  callOutline,
  downloadOutline,
  arrowForwardOutline,
  trophyOutline,
  ribbonOutline,
  addOutline,
  closeOutline,
  timeOutline,
  sparklesOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      personOutline,
      briefcaseOutline,
      readerOutline,
      newspaperOutline,
      documentTextOutline,
      calendarOutline,
      locationOutline,
      mailOutline,
      logoGithub,
      logoLinkedin,
      callOutline,
      downloadOutline,
      arrowForwardOutline,
      trophyOutline,
      ribbonOutline,
      addOutline,
      closeOutline,
      timeOutline,
      sparklesOutline,
      checkmarkCircleOutline,
    });
  }
}
