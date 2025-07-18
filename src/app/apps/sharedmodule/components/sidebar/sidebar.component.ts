import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from '../../services/side-bar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarActive = false;
  user_type: string | null;

  constructor(
    private elRef: ElementRef,
    private sidebarService: SideBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sidebarService.sidebarActive$.subscribe(state => {
      this.sidebarActive = state;
    });

    this.user_type = localStorage.getItem('user_type');
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

  logout(){
    localStorage.removeItem('access_token');
    this.router.navigate(['/homepage']);
  }
}









