import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessListComponent } from './components/business-list/business-list.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';


@NgModule({
  declarations: [
    BusinessListComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    SharedModule,

  ]
})
export class BusinessModule { }
