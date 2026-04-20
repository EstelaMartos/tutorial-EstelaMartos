import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {provideNativeDateAdapter,MAT_DATE_LOCALE,MAT_DATE_FORMATS}
from '@angular/material/core';
import { PrestamoService } from '../prestamo.service';
import { Prestamo } from '../model/Prestamo';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client.service';
import { GameService } from '../../game/game.service';
import { PrestamoEditComponent } from '../prestamo-edit/prestamo-edit.component';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

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
  selector: 'app-prestamo-list',
  standalone: true,
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatPaginatorModule,
    DialogConfirmationComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ]
})
export class PrestamoListComponent implements OnInit {

  prestamos: Prestamo[] = [];
  clients: Client[] = [];
  games: Game[] = [];

  displayedColumns = ['id', 'game', 'client', 'start', 'end', 'actions'];

  filters = {
    clientId: '',
    gameId: '',
    date: null as Date | null
  };

  pageSize = 5;
  pageIndex = 0;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private prestamoService: PrestamoService,
    private clientService: ClientService,
    private gameService: GameService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients => this.clients = clients);
    this.gameService.getGames().subscribe(games => this.games = games);
    this.loadPrestamos();
  }

  loadPrestamos(): void {
    this.prestamoService.getPrestamos({
      clientId: this.filters.clientId || null,
      gameId: this.filters.gameId || null,
      date: this.filters.date,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe(response => {
      this.prestamos = response.content;
      this.totalElements = response.totalElements;
    });
  }

  filter(): void {
    this.pageIndex = 0;
    this.loadPrestamos();
  }

  clearFilters(): void {
    this.filters = {
      clientId: '',
      gameId: '',
      date: null
    };
    this.pageIndex = 0;
    this.loadPrestamos();
  }

  loadPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrestamos();
  }

  newPrestamo(): void {
    const ref = this.dialog.open(PrestamoEditComponent, { disableClose: true });
    ref.afterClosed().subscribe(ok => ok && this.loadPrestamos());
  }

  editPrestamo(prestamo: Prestamo): void {
    const ref = this.dialog.open(PrestamoEditComponent, {
      disableClose: true,
      data: { prestamo }
    });
    ref.afterClosed().subscribe(ok => ok && this.loadPrestamos());
  }

  deletePrestamo(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar préstamo',
        description: `Atención, si borra el préstamo se perderán todos los datos.<br> ¿Desea eliminar el préstamo?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.prestamoService.deletePrestamo(id).subscribe(() => {
          this.loadPrestamos();
        });
      }
    });
  }
}
