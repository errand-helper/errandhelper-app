import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-b-dashboard',
  templateUrl: './b-dashboard.component.html',
  styleUrl: './b-dashboard.component.css'
})
export class BDashboardComponent {

  business_id:any;

  constructor(
      private _businessService: BusinessService,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private route: ActivatedRoute,
    ) {
      this.getBusinessList()
    }


  getBusinessList(){
    this._businessService.getLoggedInUserBusinessList().subscribe((res:any)=>{
      console.log(res);
      this.business_id = res[0].id;
      console.log(this.business_id);

    })
  }

}
