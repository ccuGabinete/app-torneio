import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Inscrito } from '../../models/inscrito/inscrito';
import { Equipe } from 'src/app/models/equipe/equipe';
import { Cadastro } from 'src/app/models/cadastro/cadastro';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const url = 'http://localhost:3000';
// const url = 'http://200.98.203.35:5000/';

@Injectable({
  providedIn: 'root'
})

export class CadastroService {

  constructor(private http: HttpClient) { }

  buscarCPF(cpf: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(url + '/buscar/CPF', {CPF: cpf}, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  buscarEquipes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(url + '/listar/equipes', { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  salvarEquipe(equipe: Equipe): Observable<HttpResponse<any>> {
    return this.http.post<any>(url + '/salvar/equipe', equipe, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  salvarCadastro(cadastro: Cadastro): Observable<HttpResponse<any>> {
    return this.http.post<any>(url + '/salvar/inscrito', cadastro, { observe: 'response' })
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
