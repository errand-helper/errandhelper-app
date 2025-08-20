import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';
import { BusinessDetailComponent } from './components/business-detail/business-detail.component';
import { BDashboardComponent } from './components/b-dashboard/b-dashboard.component';
import { BProfileComponent } from './components/b-profile/b-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    BusinessListComponent,
    BusinessDetailComponent,
    BDashboardComponent,
    BProfileComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule, NgbAlertModule

  ]
})
export class BusinessModule { }
