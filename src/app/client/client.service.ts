import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './model/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url = 'http://localhost:8080/client';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.url);
  }

  saveClient(client: Client): Observable<void> {
    let endpoint = this.url;
    if (client.id) {
      endpoint += '/' + client.id;
    }
    return this.http.put<void>(endpoint, client);
  }

  deleteClient(idClient: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + idClient);
  }
}

