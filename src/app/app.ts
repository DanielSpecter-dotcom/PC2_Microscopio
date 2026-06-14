import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PilcoNavbar } from './componentes/pilco-navbar/pilco-navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PilcoNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Microscopio');
}
