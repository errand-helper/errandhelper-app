import { BusinessModule } from './apps/business/business.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomepageComponent } from './components/homepage/homepage.component';

const routes: Routes = [
  { path: 'authentication', loadChildren: () => import('./apps/auth/auth.module').then(m => m.AuthModule) },
  { path: 'profile', loadChildren: () => import('./apps/profile/profile.module').then(m => m.ProfileModule),canActivate: [authGuard] },
  { path: 'business', loadChildren: () => import('./apps/business/business.module').then(m => m.BusinessModule),canActivate: [authGuard] },
  {path:'',component:HomepageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
