import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAuthenticationGuard } from './app.authguard';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [ { path: '', component: HomeComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanAuthenticationGuard]
})
export class AppRoutingModule { }
