import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrListComponent } from './components/err-list/err-list.component';
import { CrErrandComponent } from './components/cr-errand/cr-errand.component';
import { ErrDetailsComponent } from './components/err-details/err-details.component';

const routes: Routes = [
    { path: '', component: ErrListComponent },
    { path: 'create/:business_id', component: CrErrandComponent },
    { path: ':business_id', component: ErrDetailsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrandRoutingModule { }
