import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Equipe } from 'src/app/models/equipe';
import { Inscrito } from 'src/app/models/inscrito';
import { Local } from 'src/app/models/local';
import { CadastroService } from 'src/app/services/cadastro/cadastro.service';
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
  mostrarCEP = false;
  mostrarCadastrar = false;
  nomeLocal = '';
  objLocal: Local[] = [
    { tipo: 1, cep: '21235-280', nome: 'Bar do Chacra' },
    { tipo: 1, cep: '21235-280', nome: 'Bar do Romeu' },
    { tipo: 1, cep: '21235-290', nome: 'Bar do Olavo' },
    { tipo: 2, cep: '21235-290', nome: 'Clube de Bilhar' }
  ];

  locais: Local[] = [];


  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    apelido: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    representacao: new FormControl('', [Validators.required, Validators.pattern('[1-9]')])
  });

  get f(): any { return this.emailForm.get('email'); }
  get g(): any { return this.emailForm.get('apelido'); }
  get h(): any { return this.emailForm.get('cpf'); }
  get i(): any { return this.emailForm.get('representacao'); }

  constructor(
    private cpfservice: CpfService,
    public inscrito: Inscrito,
    public equipe: Equipe,
    public local: Local,
    public dialog: MatDialog,
    private cadastroservice: CadastroService
  ) { }

  ngOnInit(): void {
    this.inscrito = new Inscrito();
    this.local = new Local();
    this.inscrito.representacao = 0;
  }

  openDialog(): void {
    this.dialog.open(DialogElementsComponent);
  }

  onFocusCPF(): void {
    this.mostrarDados = false;
    this.mostrarErro = false;
  }

  onFindCPF(cpf: string): void {
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

    });

  }

  onChangeRepresentacao(event): void {
    this.mostrarCEP = false;
    if (event.target.value === '1' || event.target.value === '2') {
      this.mostrarCEP = true;
    }
  }

  onSubmit(): void {
    if (this.mostrarCadastrar) {
      this.equipe = new Equipe();
      this.equipe.NomeEquipe = this.local.nome;
      this.equipe.IDTipoEquipe = this.local.tipo;
      this.equipe.CEP = this.local.cep;

      this.cadastroservice.salvarEquipe(this.equipe).subscribe(data => {
        f(data);
      })
    }

    this.cadastroservice.salvarCadastro(this.inscrito).subscribe(data => {
      f(data);
    })
  }

  fillTest(inscricao: Inscrito): void {
    if (this.emailForm.status === 'INVALID') {
      this.openDialog();
    } else {
      this.onSubmit();
    }
  }

  filterPlace(local: Local): void {
    this.mostrarCadastrar = false;
    this.locais = [];

    f(local);

    this.locais = this.objLocal.filter(
      x => x.cep.replace('-', '') === local.cep
    );

    if (this.locais.length === 0) {
      this.mostrarCadastrar = true;
    }

    f(this.locais);
  }

  

}


@Component({
  selector: 'app-element',
  templateUrl: 'dialog.html',
})


export class DialogElementsComponent { }
