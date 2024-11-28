import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () => import('./modulos/vista-principal/vista-principal.component'),
     canActivate: [AuthGuard]
  },
   { path: 'evento/:id',
    loadComponent: () => import('./modulos/evento/evento.component'),
      canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./modulos/login/login.component')
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
