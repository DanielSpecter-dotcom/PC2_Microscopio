import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pilco-navbar',
  imports: [MatToolbar, MatToolbarRow, RouterLink, MatIcon],
  templateUrl: './pilco-navbar.html',
  styleUrl: './pilco-navbar.css',
})
export class PilcoNavbar {}
