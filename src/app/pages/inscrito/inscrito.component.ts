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
import { TooltipPosition } from '@angular/material/tooltip';
import { LogadoService } from 'src/app/services/logado/logado.service';
import { Usuario } from 'src/app/models/usuario/usuario';

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
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  disabled = false;
  mostrarOpcoes = false;


  emailForm = new FormGroup({
    apelido: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    cep: new FormControl('', Validators.required),
    representacao: new FormControl('', [Validators.required, Validators.pattern('[1-9]')]),
    bairro: new FormControl('', Validators.required),
  });

  get g(): any { return this.emailForm.get('apelido'); }
  get h(): any { return this.emailForm.get('cpf'); }
  get i(): any { return this.emailForm.get('representacao'); }
  get j(): any { return this.emailForm.get('cep'); }
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
    private router: Router,
    private logadoservice: LogadoService,
    public usuario: Usuario
  ) { }

  ngOnInit(): void {
    this.inscrito = new Inscrito();
    this.local = new Equipe();
    this.cadastro = new Cadastro();
    this.inscrito.representacao = 0;
    this.cadastroservice.buscarEquipes().subscribe(data => {
      this.objLocal = data.body;
    })

    this.usuario = new Usuario();

    this.logadoservice.currentMessage.subscribe(user => {
      this.usuario = user;
    })

  }

  shosEquipe(bool: boolean): void {
    this.mostrarOpcoes = bool;
    if (bool) {
      this.mostrarCadastrar = false;
    } else {
      this.mostrarCadastrar = true;
    }
  }

  onFocusCEP(): void {
    this.inscrito.bairro = null;
    this.inscrito.cep = null;
  }

  onFocuPlace(): void {
    this.local.CEP = null;
    this.local.NomeEquipe = null;
    this.locais = [];
    this.mostrarCadastrar = false;

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
          this.mostrarDados = true;
          this.mostrarErro = false;
        } else {
          this.dialog.open(DialogCPFComponent);
        }
      })
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

  onChangeLocal(): void {
    this.disabled = true;
    window.alert('teu cu');
  }

  onSubmit(): void {

    this.cadastro.CPF = this.inscrito.cpf;
    this.cadastro.NickName = this.inscrito.apelido;
    this.cadastro.NomeInscrito = this.inscrito.nome;
    this.cadastro.CEP = this.inscrito.cep;
    this.cadastro.NomeInscrito = this.usuario.firstName + ' ' + this.usuario.lastName;
    this.cadastro.Email = this.usuario.email;

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
        this.router.navigate(['/home']);
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

    this.locais = this.objLocal.filter(
      x => (x.CEP === local.CEP) && ((x.IDTipoEquipe == this.inscrito.representacao))
    );

    if (this.locais.length === 0) {
      this.mostrarCadastrar = true;
    }
  }

  fillPlace(): void {
    this.locais = [];
    this.local.NomeEquipe = null;
    this.mostrarCadastrar = true;
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

