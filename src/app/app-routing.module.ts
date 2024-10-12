import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'authentication', loadChildren: () => import('./apps/auth/auth.module').then(m => m.AuthModule) },
  { path: 'profile', loadChildren: () => import('./apps/profile/profile.module').then(m => m.ProfileModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
