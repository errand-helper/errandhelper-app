import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css'
})
export class BusinessListComponent implements OnInit{

  business_list:any;
  display_filter: boolean = true;

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

  displayFilters(){
    this.display_filter = !this.display_filter
  }

}
