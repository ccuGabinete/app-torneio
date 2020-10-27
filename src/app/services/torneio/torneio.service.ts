import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Torneio } from 'src/app/models/torneio/torneio';
import { Ranking } from 'src/app/models/ranking/ranking';


// const url = 'http://localhost:5000';
const url = 'https://api-torneio.herokuapp.com';

@Injectable({
  providedIn: 'root'
})

export class TorneioService{

  constructor(private http: HttpClient) { }
 
  buscarToneio(idstatus: number): Observable<HttpResponse<Torneio[]>> {
    return this.http.post<any>(url + '/listar/torneios', {IDStatusTorneio: idstatus}, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  salvarInscricaoTorneio(idtorneio: number, idinscricao: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(url + '/salvar/jogador', {IDTorneio: idtorneio, IDInscrito: idinscricao}, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  buscarInscricaoTorneio(idtorneio: number, idinscricao: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(url + '/buscar/jogador', {IDTorneio: idtorneio, IDInscrito: idinscricao}, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  buscarRankingTorneio(): Observable<HttpResponse<Ranking[]>> {
    return this.http.get<any>(url + '/listar/ranking', { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  buscarRankingGeral(): Observable<HttpResponse<Ranking[]>> {
    return this.http.get<any>(url + '/listar/ranking/geral', { observe: 'response' })
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
