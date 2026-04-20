import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from './model/Prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private url = 'http://localhost:8080/prestamo';

  constructor(private http: HttpClient) {}

  getPrestamos(params: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params.clientId) {
      httpParams = httpParams.set('clientId', params.clientId);
    }

    if (params.gameId) {
      httpParams = httpParams.set('gameId', params.gameId);
    }

    if (params.date) {
      httpParams = httpParams.set('date', params.date.toISOString().split('T')[0]);
    }

    if (params.pageNumber !== undefined) {
      httpParams = httpParams.set('pageNumber', params.pageNumber);
    }

    if (params.pageSize !== undefined) {
      httpParams = httpParams.set('pageSize', params.pageSize);
    }

    return this.http.get<any>(this.url, { params: httpParams });
  }

  savePrestamo(prestamo: Prestamo): Observable<void> {
    if (prestamo.id) {
      return this.http.put<void>(`${this.url}/${prestamo.id}`, prestamo);
    }
    return this.http.put<void>(this.url, prestamo);
  }

  deletePrestamo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
