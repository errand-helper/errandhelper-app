import { Component, OnInit } from '@angular/core';
import { ErrandService } from '../../services/errand.service';

@Component({
  selector: 'app-err-list',
  templateUrl: './err-list.component.html',
  styleUrl: './err-list.component.css'
})
export class ErrListComponent implements OnInit {

  errands:any;
  isClient:any;

  constructor(private _errandService:ErrandService){}


  ngOnInit(): void {
    this.getErrands()
    this.isClient = JSON.parse(localStorage.getItem('user_type') || '""');
    console.log(this.isClient)
  }

  getErrands(){
    this._errandService.getErrands().subscribe((res:any)=>{
      console.log(res);
      this.errands = res.results

    })
  }



}
