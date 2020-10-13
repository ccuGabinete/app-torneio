import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAuthenticationGuard } from './app.authguard';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { ColaboradorComponent } from './pages/colaborador/colaborador/colaborador.component';
import { InscritoComponent } from './pages/inscrito/inscrito.component';
import { SucessoComponent } from './pages/sucesso/sucesso/sucesso.component';

const routes: Routes = [
  { path: 'cadastro', component: InscritoComponent },
  { path: '', component: SucessoComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [CanAuthenticationGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'colaborador',
    component: ColaboradorComponent,
    canActivate: [CanAuthenticationGuard],
    data: { roles: ['colaborador'] }
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanAuthenticationGuard]
})
export class AppRoutingModule { }
