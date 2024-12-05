import { Component } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../services/photo.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, FormsModule]
})
export class Tab2Page {
  isDarkMode: boolean = false;
  licenseKey: string = '';

  toggleDarkMode() {
    // Ihre Dark Mode Logik hier
  }

  constructor(public photoService: PhotoService, private storageService: StorageService) { }

  selectedStorage: 'local' | 'test' | 'cloud' = 'local';
  cloudApiUrl: string = '';
  cloudApiKey: string = ''; 
  
  saveSettings() {
    this.storageService.setStorageType(this.selectedStorage);
    
    if (this.selectedStorage === 'cloud') {
      this.storageService.setCloudConfig(this.cloudApiUrl, this.cloudApiKey);
    }

    // Erfolgsmeldung anzeigen
    const toast = document.createElement('ion-toast');
    toast.message = 'Einstellungen wurden gespeichert';
    toast.duration = 2000;
    toast.position = 'bottom';
    document.body.appendChild(toast);
    toast.present();
  }
}
