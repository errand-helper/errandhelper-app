import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from '../../services/side-bar.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../profile/services/profile.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarActive = false;
  user_type: string | null = null;

  constructor(
    private elRef: ElementRef,
    private sidebarService: SideBarService,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
  ) {
    this.sidebarService.sidebarActive$.subscribe(state => {
      this.sidebarActive = state;
    });

    this.getUserProfile()

  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebar = this.elRef.nativeElement.querySelector('#sidebar');
    const toggle = document.querySelector('.mobile-toggle');

    if (
      window.innerWidth <= 768 &&
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      toggle &&
      !toggle.contains(event.target as Node)
    ) {
      this.sidebarService.closeSidebar();
    }
  }

  getUserProfile() {
    this.profileService.getRole().subscribe((res: any) => {
      this.user_type = res.role;
    });
  }

  logout(){
    localStorage.removeItem('access_token');
    this.router.navigate(['/homepage']);
  }
}









