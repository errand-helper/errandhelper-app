import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../../../../profile/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  profileImg:any;

  constructor(private profileService:ProfileService,private router:Router){}


  ngOnInit(): void {
    this.getProfileImg()
  }

  getProfileImg(){
    this.profileService.getProfileImg().subscribe((res:any)=>{
      console.log(res);
      this.profileImg = res.image
    })
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    this.router.navigate(['authentication/login']);
  }




}
