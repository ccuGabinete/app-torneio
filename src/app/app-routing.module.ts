import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAuthenticationGuard } from './app.authguard';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { InscritoComponent } from './pages/inscrito/inscrito.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: InscritoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanAuthenticationGuard]
})
export class AppRoutingModule { }
