import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AppModule } from '../../app.module';
import { FooterComponent } from '../sharedmodule/components/shared/footer/footer.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DecimalPipe,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgSelectModule
  ]
})
export class ProfileModule { }
