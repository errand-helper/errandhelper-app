import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { BusinessDetailComponent } from './components/business-detail/business-detail.component';
import { BDashboardComponent } from './components/b-dashboard/b-dashboard.component';

const routes: Routes = [
  { path: 'list', component:BusinessListComponent },
  { path: 'detail', component:BusinessDetailComponent },
  { path: '', component:BDashboardComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
