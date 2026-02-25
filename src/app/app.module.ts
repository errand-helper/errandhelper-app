import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HomepageComponent } from './apps/components/homepage/homepage.component';
import { NgbAlertModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { MessagesComponent } from './apps/components/messages/messages.component';


@NgModule({
  declarations: [
    AppComponent,
    // MessagesComponent,
    // HomepageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbPaginationModule, NgbAlertModule,
    // NgxSpinnerModule,
    // NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  providers: [
    DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports:[]
})
export class AppModule { }
