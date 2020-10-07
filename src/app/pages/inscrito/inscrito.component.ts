import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Inscrito } from 'src/app/models/inscrito';
import { CpfService } from 'src/app/services/cpf.service';
const f = console.log;

@Component({
  selector: 'app-inscrito',
  templateUrl: './inscrito.component.html',
  styleUrls: ['./inscrito.component.css']
})

export class InscritoComponent implements OnInit {
  mostrarDados = false;
  mostrarErro = false;
  mostrarButao = false;

  constructor(
    private cpfservice: CpfService,
    public inscrito: Inscrito,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(DialogElements);
  }

  onFocusCPF() {
    this.mostrarDados = false;
    this.mostrarErro = false;
  }

  onFindCPF(cpf: string) {
    this.cpfservice.buscarCEP(cpf).subscribe(data => {
      if (data.body.return === 'OK') {
        console.log(data.body);
        this.inscrito.nome = data.body.result.nome_da_pf;
        this.inscrito.nascimento = data.body.result.data_nascimento;
        this.mostrarDados = true;
        this.mostrarErro = false;
      } else {
        this.mostrarDados = false;
        this.mostrarErro = true;
      }

    })

  }

  fillTest(inscricao: Inscrito) {
    if(!inscricao.apelido || !inscricao.email){
      this.openDialog();
    }
  }

}


@Component({
  selector: 'DialogElements',
  templateUrl: 'dialog.html',
})


export class DialogElements{}
