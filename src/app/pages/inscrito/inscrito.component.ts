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
import { EquipeService } from 'src/app/services/equipe/equipe.service';

const p = console.log;

@Component({
  selector: 'app-inscrito',
  templateUrl: './inscrito.component.html',
  styleUrls: ['./inscrito.component.css']
})

export class InscritoComponent implements OnInit {
  mostrarDados = false;
  mostrarErro = false;
  mostrarAvisoCPF = false;
  mostrarCEP = false;
  mostrarEquipes = false;
  mostrarNomeEquipes =  false;
  mostrarLista = false;
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
    equipe: new FormControl('', [Validators.required, Validators.pattern('[1-9]')]),
    bairro: new FormControl('', Validators.required),
    cepequipe: new FormControl('', Validators.required)
  });

  get g(): any { return this.emailForm.get('apelido'); }
  get h(): any { return this.emailForm.get('cpf'); }
  get i(): any { return this.emailForm.get('equipe'); }
  get j(): any { return this.emailForm.get('cep'); }
  get k(): any { return this.emailForm.get('cepequipe'); }
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
    public usuario: Usuario,
    private equipeservice: EquipeService
  ) { }

  ngOnInit(): void {
    this.inscrito = new Inscrito();
    this.equipe = new Equipe();
    this.cadastro = new Cadastro();
    this.inscrito.IDTipoEquipe = 0;
    this.inscrito.NomeEquipe = "SEM EQUIPE";
    this.cadastroservice.buscarEquipes().subscribe(data => {
      this.objLocal = data.body;
    })

    this.usuario = new Usuario();

    this.logadoservice.currentMessage.subscribe(user => {
      this.usuario = user;
    })

  }

  onChangeEquipe(): void {
    this.mostrarCEP = true;
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

  onChangeCEP(): void {
    this.locais = this.objLocal.filter(x => x.CEP === this.inscrito.cepEquipe);
    this.locais = this.locais.filter(x => x.IDTipoEquipe == this.inscrito.IDTipoEquipe);
    this.mostrarLista = true;

  }

  onFocusCEPEquipe(): void {
    this.inscrito.cepEquipe = null;
    this.locais = [];
    this.mostrarLista = false;
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

  onChoose(bol: boolean): boolean {
    this.inscrito.NomeEquipe = null;
    this.mostrarEquipes = bol;
    this.mostrarNomeEquipes = !bol;
    return bol;
  }

  save(): void {
    if (this.emailForm.status === 'INVALID') {
      this.openDialog();
    } else {
      this.equipe.CEP = this.inscrito.cepEquipe;
      this.equipe.IDEquipe = parseInt(this.inscrito.IDEquipe);
      this.equipe.IDTipoEquipe = <number> this.inscrito.IDTipoEquipe;
     
      this.cadastroservice.salvarEquipe(this.equipe).subscribe(data => {
        this.cadastro.IDEquipe = data.body;
        this.cadastro.CPF = this.inscrito.cpf;
        this.cadastro.NickName = this.inscrito.apelido;
        this.cadastro.NomeInscrito = this.usuario.firstName + ' ' + this.usuario.lastName;
        this.cadastro.CEP = this.inscrito.cep;
        this.cadastro.Email = this.usuario.email;
        
        this.cadastroservice.salvarCadastro(this.cadastro).subscribe(data => {
          this.router.navigate(['/']);
        }, error => console.error(error))
      }, error => console.error(error));
    }
  }
  
  onSubmit(): void {

    if( this.locais.length > 0 && this.mostrarEquipes){
      this.equipe.NomeEquipe = this.inscrito.NomeEquipe;
      this.save();
    } else {
      if(!this.inscrito.NewNomeEquipe){
        this.openDialog();
      } else {
        p(this.inscrito);
        this.equipe.NomeEquipe = this.inscrito.NewNomeEquipe;
        this.save();
      }
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

