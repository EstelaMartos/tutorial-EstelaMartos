import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule,provideNativeDateAdapter,MAT_DATE_LOCALE,MAT_DATE_FORMATS}
from '@angular/material/core';

import { PrestamoService } from '../prestamo.service';
import { Prestamo } from '../model/Prestamo';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client.service';
import { GameService } from '../../game/game.service';


export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-prestamo-edit',
  standalone: true,
  templateUrl: './prestamo-edit.component.html',
  styleUrls: ['./prestamo-edit.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ]
})
export class PrestamoEditComponent implements OnInit {

  prestamo: Prestamo = {
    clientId: null,
    gameId: null,
    startDate: new Date(),
    endDate: new Date()
  };

  clients: Client[] = [];
  games: Game[] = [];
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<PrestamoEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prestamoService: PrestamoService,
    private clientService: ClientService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients => this.clients = clients);
    this.gameService.getGames().subscribe(games => this.games = games);

    if (this.data?.prestamo) {
      this.isEdit = true;
      this.prestamo = { ...this.data.prestamo };
    }
  }

  onSave(): void {
    if (!this.isValid()) {
      return;
    }

    this.prestamoService.savePrestamo(this.prestamo).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        alert(
          err?.error?.message ??
          'No se puede guardar el préstamo por conflicto de fechas.'
        );
      }
    });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  private isValid(): boolean {
    if (!this.prestamo.clientId || !this.prestamo.gameId) {
      alert('Cliente y juego son obligatorios');
      return false;
    }

    if (this.prestamo.endDate < this.prestamo.startDate) {
      alert('La fecha de fin no puede ser anterior a la de inicio');
      return false;
    }

    const diffDays =
      (this.prestamo.endDate.getTime() - this.prestamo.startDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays > 14) {
      alert('El periodo máximo de préstamo es de 14 días');
      return false;
    }

    return true;
  }
}
