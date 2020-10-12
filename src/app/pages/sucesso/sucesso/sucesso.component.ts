import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario/usuario';
import { CadastroService } from 'src/app/services/cadastro/cadastro.service';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { LogadoService } from 'src/app/services/logado/logado.service';
import { data } from 'jquery';

@Component({
  selector: 'app-sucesso',
  templateUrl: './sucesso.component.html',
  styleUrls: ['./sucesso.component.css']
})
export class SucessoComponent implements OnInit {
  mostrar: boolean;

  constructor(
    private cadastroservice: CadastroService,
    private router: Router,
    public logado: Usuario,
    private logadoservice: LogadoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.logadoservice.currentMessage.subscribe(data => {
      this.logado = data;
      this.cadastroservice.buscarEmail(this.logado.email).subscribe(data => {
        if (data.body[0].Total > 0) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/cadastro']);
        }
      })
    })
  }

}
