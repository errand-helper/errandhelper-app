import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrandRoutingModule } from './errand-routing.module';
import { ErrListComponent } from './components/err-list/err-list.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';
import { CrErrandComponent } from './components/cr-errand/cr-errand.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrDetailsComponent } from './components/err-details/err-details.component';


@NgModule({
  declarations: [
    ErrListComponent,
    CrErrandComponent,
    ErrDetailsComponent
  ],
  imports: [
    CommonModule,
    ErrandRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule, NgbAlertModule
  ]
})
export class ErrandModule { }
