import { Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SideBarService } from '../../services/side-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarActive = false;

  constructor(
    private elRef: ElementRef,
    private sidebarService: SideBarService
  ) {
    this.sidebarService.sidebarActive$.subscribe(state => {
      this.sidebarActive = state;
    });
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
}











  // user_type: string | null;

  // constructor(
  //   private route: ActivatedRoute
  // ){
  //   this.user_type = this.route.snapshot.paramMap.get('user_type');
  //   // this.isBusinessRoute()
  // }

  // isBusinessRoute(): boolean {
  //   let isBusiness = false;
  //   this.route.url.subscribe(urlSegments => {
  //     isBusiness = urlSegments.some(segment => segment.path.includes('business'));
  //   });
  //   return this.user_type === 'business';
  // }

