import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user_type: string | null;

  constructor(
    private route: ActivatedRoute
  ){
    this.user_type = this.route.snapshot.paramMap.get('user_type');
    // this.isBusinessRoute()
  }

  isBusinessRoute(): boolean {
    let isBusiness = false;
    this.route.url.subscribe(urlSegments => {
      isBusiness = urlSegments.some(segment => segment.path.includes('business'));
    });
    return this.user_type === 'business';
  }

}
