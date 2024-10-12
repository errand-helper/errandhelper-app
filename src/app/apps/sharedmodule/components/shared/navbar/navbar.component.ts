import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../../../../profile/services/profile.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  profileImg:any;

  constructor(private profileService:ProfileService){}


  ngOnInit(): void {
    this.getProfileImg()
  }

  getProfileImg(){
    this.profileService.getProfileImg().subscribe((res:any)=>{
      console.log(res);
      this.profileImg = res.image
    })
  }



}
