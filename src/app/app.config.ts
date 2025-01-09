import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Provide HttpClient for the entire application
  ],
};