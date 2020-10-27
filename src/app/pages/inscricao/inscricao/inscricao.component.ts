import { Component, OnInit } from '@angular/core';
import { Torneio } from 'src/app/models/torneio/torneio';
import { LogadoService } from 'src/app/services/logado/logado.service';
import { TorneioService } from 'src/app/services/torneio/torneio.service';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
const e = console;

@Component({
  selector: 'app-inscricao',
  templateUrl: './inscricao.component.html',
  styleUrls: ['./inscricao.component.css']
})
export class InscricaoComponent implements OnInit {
  panelOpenState = false;
  previstos: Torneio[] = [];
  abertos: Torneio[] = [];
  idinscricao: number;

  constructor
    (
      private logadoservice: LogadoService,
      private torneioservice: TorneioService,
      public dialog: MatDialog,
      private router: Router
    ) { }

  ngOnInit(): void {
    this.logadoservice.currentMessage.subscribe(x => {
      this.idinscricao = x.id;
    });
    this.torneioservice.buscarToneio(1).subscribe(data => {
      this.previstos = data.body;
      this.previstos.forEach(x => {
        let dt = DateTime.fromISO(this.abertos[0].DataTorneio.toString())
        x.Data = dt.day + '/' + dt.monthLong + '/' + dt.year;
      })
    }, err => e.log(err))

    this.torneioservice.buscarToneio(2).subscribe(data => {
      this.abertos = data.body;
      this.abertos.forEach(x => {
        let dt = DateTime.fromISO(this.abertos[0].DataTorneio.toString())
        x.Data = dt.day + '/' + dt.monthLong + '/' + dt.year;
      })

    }, err => e.log(err))

    
  }

  onInscricao(idtorneio: number): void {
    this.torneioservice.buscarInscricaoTorneio(idtorneio, this.idinscricao).subscribe(data => {
      if(data.body[0].TOTAL === 0){
        this.torneioservice.salvarInscricaoTorneio(idtorneio, this.idinscricao).subscribe(() => {
          this.dialog.open(DialogConfirmaInscritoComponent);
        }, err => e.log(err))
      }else {
        this.dialog.open(DialogAvisoComponent);
      }
    }, err => e.log(err))

    
  }

  onInicio(): void {
    this.router.navigate(['/']);
  }

}

@Component({
  selector: 'app-inscrito',
  templateUrl: 'confirmainscrito.html',
})

export class DialogConfirmaInscritoComponent { }

@Component({
  selector: 'app-aviso',
  templateUrl: 'aviso.html',
})

export class DialogAvisoComponent { }
