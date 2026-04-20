import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../model/Client';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {

  client: Client = new Client();

  constructor(
    public dialogRef: MatDialogRef<ClientEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    if (this.data.client) {
      this.client = Object.assign({}, this.data.client);
    }
  }

  onSave() {
    this.clientService.saveClient(this.client).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        alert("Error al guardar: Verifique que el nombre no esté duplicado.");
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
