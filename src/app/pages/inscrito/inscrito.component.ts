import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Cadastro } from 'src/app/models/cadastro/cadastro';
import { Equipe } from 'src/app/models/equipe/equipe';
import { Inscrito } from 'src/app/models/inscrito/inscrito';
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
  objLocal: Equipe[] = [];

  locais: Equipe[] = [];


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
    public local: Equipe,
    public dialog: MatDialog,
    private cadastroservice: CadastroService,
    public cadastro: Cadastro
  ) { }

  ngOnInit(): void {
    this.inscrito = new Inscrito();
    this.local = new Equipe();
    this.cadastro = new Cadastro();
    this.inscrito.representacao = 0;
    this.cadastroservice.buscarEquipes().subscribe(data => {
      this.objLocal = data.body;
    })
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

  onChangeNomeEquipe(): void {
    this.equipe = new Equipe();
    this.equipe.NomeEquipe = this.local.NomeEquipe;
    this.equipe.IDTipoEquipe = this.inscrito.representacao;
    this.equipe.CEP = this.local.CEP;
    this.cadastroservice.salvarEquipe(this.equipe).subscribe(data => {
    })
  }

  onSubmit(): void {

    this.cadastro.CPF = this.inscrito.cpf;
    this.cadastro.DataNascimento = this.inscrito.nascimento.substring(6) + this.inscrito.nascimento.substring(3, 5) + this.inscrito.nascimento.substring(0, 2);
    this.cadastro.NickName = this.inscrito.apelido;
    this.cadastro.Email = this.inscrito.email;
    this.cadastro.NomeInscrito = this.inscrito.nome;

    this.cadastroservice.buscarEquipes().subscribe(data => {

      let obj = data.body;
      f(this.local.NomeEquipe.toUpperCase());
      f(this.local);
      obj = obj.filter(x => x.NomeEquipe === this.local.NomeEquipe.toUpperCase());
      let id = obj[0].IDEquipe;
      this.cadastro.IDEquipe = id;

      this.cadastroservice.salvarCadastro(this.cadastro).subscribe(data => {
        f(data);
      }, error => {
        console.error(error);
      })

    })

  }

  fillTest(inscricao: Inscrito): void {
    if (this.emailForm.status === 'INVALID') {
      this.openDialog();
    } else {
      this.onSubmit();
    }
  }

  filterPlace(local: Equipe): void {
    this.mostrarCadastrar = false;
    this.locais = [];
    this.local.NomeEquipe = '';

    f(local);

    this.locais = this.objLocal.filter(
      x => x.CEP === local.CEP
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
