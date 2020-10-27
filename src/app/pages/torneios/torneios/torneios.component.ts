import { Component, OnInit } from '@angular/core';
import { Ranking } from 'src/app/models/ranking/ranking';
import { DateTime } from 'luxon';
import { Usuario } from 'src/app/models/usuario/usuario';
import { LogadoService } from 'src/app/services/logado/logado.service';
import { TorneioService } from 'src/app/services/torneio/torneio.service';
import { Router } from '@angular/router';
const e = console;



@Component({
  selector: 'app-torneios',
  templateUrl: './torneios.component.html',
  styleUrls: ['./torneios.component.css']
})
export class TorneiosComponent implements OnInit {

  rankings: Ranking[] = [];
  rankTorneio: Ranking[] = [];
  dataTorneios: any[] = [];
  torneios = [];
  panelOpenState: boolean;
  posGeral: number;
  posTorneio: number;
  idtorneio: number = -1;

  constructor(
    private torneioservice: TorneioService,
    private logadoservice: LogadoService,
    public usuario: Usuario,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = new Usuario;

    this.logadoservice.currentMessage.subscribe(data => {
      this.usuario = data;

      this.torneioservice.buscarRankingGeral().subscribe(data => {
        this.rankings = data.body;
        this.posGeral = this.rankings.findIndex(x => x.IDInscrito === this.usuario.id) + 1;
      }, err => e.error(err));

      let count = 0;

      this.torneioservice.buscarRankingTorneio().subscribe(data => {
        this.rankTorneio = data.body;
        this.rankTorneio.forEach((x, y) => {
          let dt = DateTime.fromISO(x.DataTorneio.toString());
          x.DataTorneio = dt.day + '/' + dt.monthLong + '/' + dt.year;
          if (this.dataTorneios.indexOf(x.DataTorneio) === -1) {
            this.dataTorneios.push(x.DataTorneio);
            this.torneios.push({pos: count, data: x.DataTorneio});
            count++;
          }
        })

      }, err => e.error(err));

    }, err => e.error(err));

  }

  getRankingGeral(): number {
    let index = this.rankings.findIndex(x => x.IDInscrito === this.usuario.id);
    return index;
  }

  onInicio(): void {
    this.router.navigate(['/']);
  }

  onChangeTorneios(event): void {
    let aux: Ranking[] = [];
    if(event !== "-1"){
      let data = this.dataTorneios[event];
      aux = this.rankTorneio.filter(x => x.DataTorneio === data);   
      let index = aux.findIndex(x => x.IDInscrito === this.usuario.id);
      this.posTorneio = index + 1;
    }
  }
}
