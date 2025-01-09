import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../interfaces/auth.interfaces'; // Only import SignupRequest

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add ReactiveFormsModule and CommonModule
})
export class SignupComponent implements OnDestroy {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]], // Username with validation
        email: ['', [Validators.required, Validators.email]], // Email with validation
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/), // Password must contain uppercase, lowercase, and number
          ],
        ],
        confirmPassword: ['', Validators.required], // Confirm password with validation
      },
      {
        validator: this.passwordMatchValidator, // Custom validator to check if passwords match
      }
    );
  }

  private passwordMatchValidator(form: FormGroup): null | { passwordMismatch: true } {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const signupData: SignupRequest = {
        username: this.signupForm.value.username,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };

      this.authService.signup(signupData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.errorMessage = 'Signup successful!'; // Display success message
            this.signupForm.reset(); // Clear all form fields
            this.router.navigate(['/home']); // Redirect to home page
          },
          error: (error) => {
            console.error('Signup error:', error);
            this.errorMessage = error.message || ''; // Display error message
          },
          complete: () => {
            this.isLoading = false; // Reset loading state
          },
        });
    } else {
      this.markFormGroupTouched(this.signupForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}