import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../services/business.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrl: './business-detail.component.css',
})
export class BusinessDetailComponent implements OnInit {
  businessId!:string;
  business_details:any;
  faqs:any[] = [];

  constructor(
    private _businessService: BusinessService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('id')!;
    this.getBusinessInfo()
  }

  getBusinessInfo() {
    this._businessService.getBusinessDetail(this.businessId).subscribe((res:any)=>{
      this.business_details = res;
      this.faqs = res.frequently_asked_questions;
    })
  }



  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  navigateBack() {
    window.history.back();
  }
}
