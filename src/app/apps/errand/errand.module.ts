import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrandRoutingModule } from './errand-routing.module';
import { ErrListComponent } from './components/err-list/err-list.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';
import { CrErrandComponent } from './components/cr-errand/cr-errand.component';


@NgModule({
  declarations: [
    ErrListComponent,
    CrErrandComponent
  ],
  imports: [
    CommonModule,
    ErrandRoutingModule,
    SharedModule
  ]
})
export class ErrandModule { }
