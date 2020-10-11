import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAuthenticationGuard } from './app.authguard';
import { InscritoComponent } from './pages/inscrito/inscrito.component';
import { SucessoComponent } from './pages/sucesso/sucesso/sucesso.component';

const routes: Routes = [
  { path: 'cadastro', component: InscritoComponent },
  { path: '', component: SucessoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanAuthenticationGuard]
})
export class AppRoutingModule { }
