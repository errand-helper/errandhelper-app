import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CDashboardComponent } from './c-dashboard/c-dashboard.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';


@NgModule({
  declarations: [CDashboardComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
