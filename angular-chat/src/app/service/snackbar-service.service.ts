import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackbarServiceService {
  constructor(private snackBar: MatSnackBar) {
  }
  snackbarDisplay(message: any) {
    this.snackBar.open(message, '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',
      });
  }
}