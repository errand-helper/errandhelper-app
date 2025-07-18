import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';
import { BusinessDetailComponent } from './components/business-detail/business-detail.component';
import { BDashboardComponent } from './components/b-dashboard/b-dashboard.component';


@NgModule({
  declarations: [
    BusinessListComponent,
    BusinessDetailComponent,
    BDashboardComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    SharedModule,

  ]
})
export class BusinessModule { }
