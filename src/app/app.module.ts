import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscritoComponent } from './pages/inscrito/inscrito.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Inscrito } from './models/inscrito/inscrito';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Local } from './models/local/local';
import { Equipe } from './models/equipe/equipe';
import { Cadastro } from './models/cadastro/cadastro';
import { Cep } from './models/cep/cep';
import { SucessoComponent } from './pages/sucesso/sucesso/sucesso.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Usuario } from './models/usuario/usuario';
import { MatExpansionModule } from '@angular/material/expansion';
import { InscricaoComponent } from './pages/inscricao/inscricao/inscricao.component';
import { Torneio } from './models/torneio/torneio';
import { Jogador } from './models/jogador/jogador';
import { TorneiosComponent } from './pages/torneios/torneios/torneios.component';
import { Ranking } from './models/ranking/ranking';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    InscritoComponent,
    SucessoComponent,
    InscricaoComponent,
    TorneiosComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [
    Inscrito,
    Local,
    Equipe,
    Cadastro,
    Cep,
    Usuario,
    Torneio,
    Jogador,
    Ranking,
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
  ],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    keycloakService
      .init({
        config: {
          url: 'https://adrenalinamaxima.com.br/auth/',
          realm: 'LCS',
          clientId: 'torneio-inscricao'
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
        },
        enableBearerInterceptor: true,
        bearerExcludedUrls: ['/assets', '/clients/public'],
      })
      .then(() => {
        console.log('[ngDoBootstrap] bootstrap app');

        appRef.bootstrap(AppComponent);
      })
      .catch((error) =>
        console.error('[ngDoBootstrap] init Keycloak failed', error)
      );
  }
}
