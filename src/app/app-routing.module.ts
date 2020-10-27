import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAuthenticationGuard } from './app.authguard';
import { InscricaoComponent } from './pages/inscricao/inscricao/inscricao.component';
import { InscritoComponent } from './pages/inscrito/inscrito.component';
import { SucessoComponent } from './pages/sucesso/sucesso/sucesso.component';
import { TorneiosComponent } from './pages/torneios/torneios/torneios.component';

const routes: Routes = [
  { path: 'cadastro', component: InscritoComponent },
  { path: '', component: SucessoComponent },
  { path: 'inscricao', component: InscricaoComponent },
  { path: 'torneios', component: TorneiosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanAuthenticationGuard]
})
export class AppRoutingModule { }
