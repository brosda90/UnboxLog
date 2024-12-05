import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { settingsOutline,trash } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class Tab3Page implements OnInit {
  images$: Observable<string[]>;

  constructor(public photoService: PhotoService, private router: Router) {
    addIcons({ trash,settingsOutline });
    this.images$ = this.photoService.images$;
  }

  ngOnInit() {
  }

  deleteImage(index: number) {
    this.photoService.deleteImage(index);
  }

  closeGallery() {
    console.log('Galerie geschlossen');
  }

  navigateToSettings() {
    this.router.navigate(['/tabs/tab2']);
  }
}
