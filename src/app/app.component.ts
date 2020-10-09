import { Component, OnInit } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
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
    private router: Router
    ) {}

  logout(){
    this.router.navigate(['/']);
    window.open("http://ligadoscampeoesdasinuca.epizy.com/", "_blank");
    this.keycloakService.logout();
  }

  async ngOnInit(): Promise<void> {
    let user = await this.keycloakService.loadUserProfile();
    this.usuario = user.firstName + ' ' + user.lastName;
    if(this.keycloakService.isTokenExpired()) {
      this.logout();
    }
  }

  
  
}
