import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Inscrito } from '../../models/inscrito';
import { Equipe } from 'src/app/models/equipe';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CadastroService {

  constructor(private http: HttpClient) { }


  buscarEquipes(): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://200.98.203.35:5000/listar/equipes', { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  salvarEquipe(equipe: Equipe): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://200.98.203.35:5000/salvar/equipe', equipe, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  salvarCadastro(inscrito: Inscrito): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://200.98.203.35:5000/salvar/inscrito', inscrito, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
