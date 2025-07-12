import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private sidebarActiveSubject = new BehaviorSubject<boolean>(false);
  sidebarActive$ = this.sidebarActiveSubject.asObservable();

  toggleSidebar() {
    const current = this.sidebarActiveSubject.getValue();
    this.sidebarActiveSubject.next(!current);
  }

  closeSidebar() {
    this.sidebarActiveSubject.next(false);
  }
  
}
