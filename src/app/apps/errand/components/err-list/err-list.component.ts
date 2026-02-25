import { Component, OnInit, signal } from '@angular/core';
import { ErrandService } from '../../services/errand.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../../profile/services/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-err-list',
  templateUrl: './err-list.component.html',
  styleUrl: './err-list.component.css',
})
export class ErrListComponent implements OnInit {
  errands: any;
  isClient: string = '';
  page = signal(1);
  pageSize = signal(10);
  totalErrandListItems = signal(0);
  searchTerm: string = '';
  status: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    private _errandService: ErrandService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getErrands();
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page.set(1);
        this.getErrands();
      });

    this.getUserProfile();
  }

  getUserProfile() {
    this.isLoading = true;
    this.profileService.getRole().subscribe((res: any) => {
      this.isClient = res.role;
      this.isLoading = false;
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
    this.isLoading = true;
    this._errandService
      .getErrands(this.page(), this.pageSize(), this.status, this.searchTerm)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
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
