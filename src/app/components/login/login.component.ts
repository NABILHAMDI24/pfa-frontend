import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, // Mark the component as standalone
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  show2FAInput = false; // Afficher l'interface 2FA après la première étape
  errorMessage: string | null = null; // Message d'erreur
  usernameFor2FA: string | null = null; // Nom d'utilisateur pour la vérification 2FA
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      code: [''] // Champ pour le code 2FA
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password, code } = this.loginForm.value;

      if (!this.show2FAInput) {
        // Première étape : Vérifier les informations de connexion
        this.authService.login(username, password)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log('2FA code sent:', response);
              this.show2FAInput = true; // Afficher l'interface 2FA
              this.usernameFor2FA = response.username; // Stocker le nom d'utilisateur pour la vérification 2FA
              this.isLoading = false;
              this.errorMessage = null; // Réinitialiser le message d'erreur
            },
            error: (error) => {
              console.error('Login error:', error);
              this.isLoading = false;
              this.errorMessage = error; // Afficher le message d'erreur du backend
            }
          });
      } else {
        // Deuxième étape : Vérifier le code 2FA
        this.authService.verify2FA(this.usernameFor2FA!, code)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log('Login successful:', response);
              this.router.navigate(['/id-card-upload']); // Rediriger vers la page id-card-upload
            },
            error: (error) => {
              console.error('2FA verification error:', error);
              this.isLoading = false;
              this.errorMessage = error; // Afficher le message d'erreur du backend
            }
          });
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}