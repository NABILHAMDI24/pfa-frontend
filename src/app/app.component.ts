import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Import RouterModule
  template: `
    <router-outlet></router-outlet> <!-- Render routed components here -->
  `,
})
export class AppComponent {}