import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-id-card-upload',
  templateUrl: './id-card-upload.component.html',
  styleUrls: ['./id-card-upload.component.css'],
  standalone: true, // Mark the component as standalone
  imports: [CommonModule] // Import CommonModule here
})
export class IdCardUploadComponent {
  selectedFile: File | null = null; // Fichier image sélectionné
  cnieData: any = null; // Données CNIE extraites
  errorMessage: string | null = null; // Message d'erreur
  isLoading: boolean = false; // Indicateur de chargement

  constructor(private http: HttpClient) {}

  // Méthode appelée lorsqu'un fichier est sélectionné
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  // Méthode pour envoyer l'image au backend et récupérer les données CNIE
  onUpload() {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner une image à télécharger.';
      return;
    }

    this.isLoading = true; // Activer l'indicateur de chargement
    this.errorMessage = null; // Réinitialiser le message d'erreur

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Appeler l'API backend pour traiter l'image
    this.http.post<any>('http://localhost:8081/upload', formData).subscribe(
      (response) => {
        this.cnieData = response; // Stocker les données CNIE reçues
        this.isLoading = false; // Désactiver l'indicateur de chargement
      },
      (error) => {
        this.errorMessage = 'Erreur lors du traitement de l\'image. Veuillez réessayer.';
        this.isLoading = false; // Désactiver l'indicateur de chargement
        console.error(error);
      }
    );
  }
}