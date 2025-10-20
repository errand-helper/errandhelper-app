import { Component, OnInit, signal } from '@angular/core';
import { ErrandService } from '../../services/errand.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-err-list',
  templateUrl: './err-list.component.html',
  styleUrl: './err-list.component.css',
})
export class ErrListComponent implements OnInit {
  errands: any;
  isClient: any;
  page = signal(1);
  pageSize = signal(10);
  totalErrandListItems = signal(0);
  searchTerm: string = '';
  status: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private _errandService: ErrandService) {}

  ngOnInit(): void {
    this.getErrands();
    this.isClient = JSON.parse(localStorage.getItem('user_type') || '""');
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page.set(1);
        this.getErrands();
      });
  }

  onErrandListPageChange(newPage: number) {
    this.page.set(newPage);
    this.getErrands();
  }

  onStatusChange() {
  this.page.set(1);
  this.getErrands();
}


  getErrands() {
    this._errandService
      .getErrands(this.page(), this.pageSize(), this.status, this.searchTerm)
      .subscribe({
        next: (res: any) => {
          this.errands = res.results;
          this.totalErrandListItems.set(res.count);
        },
        error: (err) => console.error('Error loading businesses:', err),
      });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }
}
