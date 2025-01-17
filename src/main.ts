import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importez provideHttpClient et withInterceptors si nécessaire
import { importProvidersFrom } from '@angular/core'; // Si vous avez besoin d'importer des modules supplémentaires

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configuration des routes
    provideAnimations(), // Activation des animations
    provideHttpClient(), // Activation du HttpClient
    // Si vous avez besoin d'intercepteurs, utilisez withInterceptors :
    // provideHttpClient(withInterceptors([yourInterceptor])),
    // Si vous avez besoin d'importer des modules supplémentaires, utilisez importProvidersFrom :
    // importProvidersFrom(YourModule),
  ]
}).catch(err => console.error(err));