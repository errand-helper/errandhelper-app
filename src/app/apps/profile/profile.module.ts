import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AppModule } from '../../app.module';
import { FooterComponent } from '../sharedmodule/components/shared/footer/footer.component';
import { SharedModule } from '../sharedmodule/sharedmodule.module';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
