import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { PhotoService } from './photo.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageType = new BehaviorSubject<string>('local');
  private ftpConfig = {
    host: '',
    port: 21,
    username: '',
    password: '',
    nativePath: ''
  };

  private cloudConfig = {
    apiUrl: '',
    apiKey: ''
  };

  constructor(private photoService: PhotoService) { }

  // Getter und Setter für Storage-Konfiguration
  setStorageType(type: 'local' | 'test' | 'cloud' | 'ftp') {
    this.storageType.next(type);
  }

  getStorageType() {
    return this.storageType.value;
  }

  setCloudConfig(apiUrl: string, apiKey: string) {
    this.cloudConfig = { apiUrl, apiKey };
  }

  public async saveAnswers(kundennummer: string, name: string, answers: any): Promise<void> {
    switch (this.storageType.value) {
      case 'local':
        await this.saveToLocal(kundennummer, name, answers);
        break;
      case 'test':
        await this.saveToTest(kundennummer, name, answers);
        break;
      case 'cloud':
        await this.saveToCloud(kundennummer, name, answers);
        break;
      default:
        await this.saveToLocal(kundennummer, name, answers);
    }
  }

  private async saveToLocal(kundennummer: string, name: string, answers: any): Promise<void> {
    const folderName = `KD${kundennummer} ${name}`;
    
    try {
      await Filesystem.mkdir({
        path: folderName,
        directory: Directory.Documents,
        recursive: true
      });

      await this.saveAnswersAsTxt(folderName, answers);
      await this.saveImages(folderName);
      
      console.log('Daten lokal gespeichert');
    } catch (error) {
      console.error('Fehler beim lokalen Speichern:', error);
      throw error;
    }
  }

  private async saveToTest(kundennummer: string, name: string, answers: any): Promise<void> {
    // Dummy-Implementierung für Test-Modus (PC)
    console.log('Test-Modus Speicherung:', {
      kundennummer,
      name,
      answers,
      images: await this.photoService.getImages()
    });
  }

  private async saveToCloud(kundennummer: string, name: string, answers: any): Promise<void> {
    // Dummy-Implementierung für Cloud-Speicherung
    if (!this.cloudConfig.apiKey || !this.cloudConfig.apiUrl) {
      throw new Error('Cloud-Konfiguration fehlt');
    }

    console.log('Cloud-Speicherung simuliert:', {
      apiUrl: this.cloudConfig.apiUrl,
      data: {
        kundennummer,
        name,
        answers,
        images: await this.photoService.getImages()
      }
    });
  }

  private async saveAnswersAsTxt(folderPath: string, answers: any): Promise<void> {
    const fileName = 'antworten.txt';
    const textContent = this.formatAnswersAsText(answers);

    await Filesystem.writeFile({
      path: `${folderPath}/${fileName}`,
      data: textContent,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
  }

  private async saveImages(folderPath: string): Promise<void> {
    const images = await this.photoService.getImages();
    
    for (let i = 0; i < images.length; i++) {
      const imageData = images[i].replace(/^data:image\/\w+;base64,/, '');
      const fileName = `bild_${i + 1}.jpg`;

      await Filesystem.writeFile({
        path: `${folderPath}/${fileName}`,
        data: imageData,
        directory: Directory.Documents
      });
    }
  }

  private formatAnswersAsText(answers: any): string {
    const formattedAnswers = [
      `Umverpackung: ${answers.Umverpackung}`,
      `Polsterung: ${answers.Polsterung}`,
      `Gehäuse Karton: ${answers.fragen[2]}`,
      `Inlets: ${answers.fragen[3]}`,
      `Innenraumsicherung: ${answers.innenraumsicherungStatus ? `Ja - ${answers.innenraumsicherungStatus}` : 'Nein'}`,
      `Gehäuse beschädigt: ${answers['Gehäuse beschädigt']}`,
      `Gebrauchspuren: ${answers.fragen[6]}`,
      `GPU ausgebaut mitgeschickt: ${answers.fragen[7]}`,
      `Zubehör mitgeschickt: ${answers.fragen[8]}`,
      `Reklamationsschein: ${answers.fragen[9]}`,
      '',
      `Sonstiges: ${answers.Sonstiges || ''}`,
      'Windows:'
    ];

    return formattedAnswers.join('\n');
  }
}
