import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm.dialogo',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './confirm.dialogo.html',
  styleUrl: './confirm.dialogo.css',
})
export class ConfirmDialogo {}
