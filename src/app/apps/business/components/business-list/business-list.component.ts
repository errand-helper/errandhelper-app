import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css'
})
export class BusinessListComponent implements OnInit{

  business_list:any;

  constructor(
    private _businessService:BusinessService
  ){}

  ngOnInit(){
   this.getBusinessList()
  }

  getBusinessList(){
    this._businessService.getBusinessList().subscribe((res:any)=>{
      console.log(res);
      this.business_list = res;
    })

  }

}
