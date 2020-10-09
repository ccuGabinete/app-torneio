import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Cadastro } from 'src/app/models/cadastro/cadastro';
import { Equipe } from 'src/app/models/equipe/equipe';
import { Inscrito } from 'src/app/models/inscrito/inscrito';
import { CadastroService } from 'src/app/services/cadastro/cadastro.service';
import { CpfService } from 'src/app/services/cpf/cpf.service';
import { cpf } from 'cpf-cnpj-validator';
import { CepService } from 'src/app/services/cep/cep.service';
import { Router } from '@angular/router';

const p = console.log;

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
  mostrarAvisoCPF = false;
  nomeLocal = '';
  objLocal: Equipe[] = [];
  locais: Equipe[] = [];


  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    apelido: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    cep: new FormControl('', Validators.required),
    representacao: new FormControl('', [Validators.required, Validators.pattern('[1-9]')]),
    codigo: new FormControl('', Validators.required),
    bairro: new FormControl('', Validators.required),
  });

  get f(): any { return this.emailForm.get('email'); }
  get g(): any { return this.emailForm.get('apelido'); }
  get h(): any { return this.emailForm.get('cpf'); }
  get i(): any { return this.emailForm.get('representacao'); }
  get j(): any { return this.emailForm.get('cep'); }
  get k(): any { return this.emailForm.get('codigo'); }
  get l(): any { return this.emailForm.get('bairro'); }

  constructor(
    private cpfservice: CpfService,
    public inscrito: Inscrito,
    public equipe: Equipe,
    public local: Equipe,
    public dialog: MatDialog,
    private cadastroservice: CadastroService,
    public cadastro: Cadastro,
    private cepservice: CepService,
    private router: Router
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

  onFocusCEP(): void {
    this.inscrito.bairro = null;
    this.inscrito.cep = null;
  }

  getCEP(): void {
    if (this.emailForm.get('cep').valid) {
      this.cepservice.buscarCEP(this.inscrito.cep).subscribe(data => {
        this.inscrito.bairro = data.body.bairro + ' - ' + data.body.localidade;
      })
    }
  }


  getCodigo(): string {
    let tam = this.inscrito.email.toString().length + 65252000;
    return tam.toString(16);
  }


  confirmCodigo(): void {
    if (this.inscrito.codigo !== this.getCodigo()) {
      this.dialog.open(DialogCodigoComponent);
    } else {
      this.dialog.open(DialogConfirmaComponent);
    }
  }

  onSendEmail(): void {
    if (this.emailForm.get('email').valid) {
      this.cadastroservice.enviarEmail(this.inscrito.email, 'Código: ' + this.getCodigo()).subscribe(data => {
        p(data);
        this.dialog.open(DialogMSGComponent);
      })
    }
  }

  onCPF(): Boolean {
    return cpf.isValid(this.inscrito.cpf);
  }

  openDialog(): void {
    this.dialog.open(DialogElementsComponent);
  }

  onFocusCPF(): void {
    this.mostrarDados = false;
    this.mostrarErro = false;
    this.mostrarAvisoCPF = false;
    this.inscrito.cpf = null;
  }

  onFindCPF(cpf: string): void {
    this.mostrarAvisoCPF = false;

    if (this.onCPF()) {
      this.cadastroservice.buscarCPF(this.inscrito.cpf).subscribe(data => {
        if (data.body[0].Total === 0) {
          this.cpfservice.buscarCPF(cpf).subscribe(data => {
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
        } else {
          this.dialog.open(DialogCPFComponent);
        }
      })
    } else {
      this.mostrarAvisoCPF = true;
    }



    if (this.onCPF()) {

    } else {
      this.mostrarAvisoCPF = true;
    }



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
    this.cadastro.CEP = this.inscrito.cep;

    this.cadastroservice.buscarEquipes().subscribe(data => {


      if (this.local.NomeEquipe) {
        let obj = data.body;
        obj = obj.filter(x => x.NomeEquipe === this.local.NomeEquipe.toUpperCase());
        let id = obj[0].IDEquipe;
        this.cadastro.IDEquipe = id;
      } else {
        this.cadastro.IDEquipe = "28";
      }


      this.cadastroservice.salvarCadastro(this.cadastro).subscribe(data => {
        this.router.navigate(['/sucesso']);
      }, error => {
        console.error(error);
      })

    })

  }

  fillTest(inscricao: Inscrito): void {

    if (this.inscrito.codigo !== this.getCodigo()) {
      this.dialog.open(DialogCodigoComponent);
    } else {
      if (this.emailForm.status === 'INVALID') {
        this.openDialog();
      } else {
        this.onSubmit();
      }
    }

  }

  filterPlace(local: Equipe): void {
    this.mostrarCadastrar = false;
    this.locais = [];
    this.local.NomeEquipe = '';

    this.locais = this.objLocal.filter(
      x => x.CEP === local.CEP
    );

    if (this.locais.length === 0) {
      this.mostrarCadastrar = true;
    }
  }

}


@Component({
  selector: 'app-element',
  templateUrl: 'dialog.html',
})

export class DialogElementsComponent { }


@Component({
  selector: 'app-cpf',
  templateUrl: 'cpf.html',
})

export class DialogCPFComponent { }

@Component({
  selector: 'app-msg',
  templateUrl: 'msg.html',
})

export class DialogMSGComponent { }

@Component({
  selector: 'app-codigo',
  templateUrl: 'codigo.html',
})

export class DialogCodigoComponent { }

@Component({
  selector: 'app-confirma',
  templateUrl: 'confirmacao.html',
})

export class DialogConfirmaComponent { }

