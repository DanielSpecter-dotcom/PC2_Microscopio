import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pilco-navbar',
  imports: [MatToolbar, MatToolbarRow, RouterLink],
  templateUrl: './pilco-navbar.html',
  styleUrl: './pilco-navbar.css',
})
export class PilcoNavbar {}
