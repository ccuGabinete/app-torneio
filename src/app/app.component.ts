import { Component, OnInit } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
const f = console.log;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-torneio';
  usuario = '';

  constructor(public keycloakService: KeycloakService) {

  }

  logout(){
    this.keycloakService.logout();
  }

  async ngOnInit(): Promise<void> {
    let user = await this.keycloakService.loadUserProfile();
    this.usuario = 'Bem vindo, ' + user.firstName + ' ' + user.lastName;
    if(this.keycloakService.isTokenExpired()) {
      this.logout();
    }
  }

  
  
}
