import { Component, Input, OnInit } from '@angular/core';
// import { ProfileService } from '../../../../profile/services/profile.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../../profile/services/profile.service';
import { SideBarService } from '../../services/side-bar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  profileImg:any;
  isCreateRoute = false;


  constructor(private profileService:ProfileService,private router:Router,private sidebarService: SideBarService){
    this.router.events.subscribe(() => {
      this.isCreateRoute = this.router.url.includes('create');
    });
  }


  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }


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
    this.router.navigate(['login']);
  }




}
