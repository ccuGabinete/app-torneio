import { Component, OnInit } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { LogadoService } from './services/logado/logado.service';
import { Usuario } from './models/usuario/usuario';
import { CadastroService } from './services/cadastro/cadastro.service';
const f = console.log;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-torneio';
  usuario = '';


  constructor(
    public keycloakService: KeycloakService,
    private router: Router,
    private logadoservice: LogadoService,
    public logado: Usuario,
    private cadastroservice: CadastroService
  ) { }

  logout() {
    this.router.navigate(['/']);
    window.open("http://ligadoscampeoesdasinuca.epizy.com/", "_blank");
    this.keycloakService.logout();
  }

  async ngOnInit(): Promise<void> {
    let user = await this.keycloakService.loadUserProfile();
    this.logado = new Usuario();
    this.logado.email = user.email;
    this.logado.emailVerified = user.emailVerified;
    this.logado.firstName = user.firstName;
    this.logado.lastName = user.lastName;
    this.logado.username = user.username;
    this.logado.rules = this.keycloakService.getUserRoles();

    this.logadoservice.mudarUsuario(this.logado);
    this.usuario = user.firstName + ' ' + user.lastName;
    if (this.keycloakService.isTokenExpired()) {
      this.logout();
    }

    this.cadastroservice.buscarEmail(this.logado.email).subscribe(data => {
      if (data.body[0].Total > 0) {
        if (this.logado.rules.indexOf('admin') !== -1) {
          this.router.navigate(['/admin']);
        } else if (this.logado.rules.indexOf('colaborador') !== -1) {
          this.router.navigate(['/colaborador']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/cadastro']);
      }
    })
  }
}
