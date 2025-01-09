import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // Import provideRouter
import { routes } from './app/app.routes'; // Import your routes
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import provideAnimations

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide the router configuration
    provideAnimations(), // Provide animations
    ...appConfig.providers, // Include other providers from appConfig
  ],
}).catch((err) => console.error(err));