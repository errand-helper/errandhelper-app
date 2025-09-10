import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css',
})
export class BusinessListComponent implements OnInit, OnDestroy {
  business_list: any;
  categories: any;
  serviceAreas: any = []; // <-- dynamic locations fetched from API if needed
  display_filter: boolean = true;

  page = signal(1);
  pageSize = signal(10);
  totalServiceItems = signal(0);
  totalServiceAreaItems = signal(0);

  selectedCategories: string[] = [];
  selectedLocations: string[] = []; // <-- track selected locations
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private _businessService: BusinessService,) {}

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(400), // wait 400ms after user stops typing
        distinctUntilChanged(), // only emit if value is different from last one
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.page.set(1); // Reset to first page
        this.getBusinessList();
      });

    this.getBusinessList();
    this.getCategories();
    this.getServiceAreas();
    this.getBusinessStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onServiceCategoryChange(event: any, categoryId: string) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedCategories = [...this.selectedCategories, categoryId];
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== categoryId
      );
    }
    this.getBusinessList();
  }

  onLocationChange(event: any, location: string) {
    const checked = event.target.checked;
    if (checked) {
      this.selectedLocations = [...this.selectedLocations, location];
    } else {
      this.selectedLocations = this.selectedLocations.filter(
        (loc) => loc !== location
      );
    }
    this.getBusinessList();
  }

  getBusinessList() {
    this._businessService
      .getBusinessList(
        this.page(),
        this.pageSize(),
        this.selectedCategories,
        this.selectedLocations,
        this.searchTerm
      )
      .subscribe({
        next: (res: any) => {
          this.business_list = res.results;
          this.totalServiceItems.set(res.count);
        },
        error: (err) => console.error('Error loading businesses:', err),
      });
  }

   getBusinessStats() {
    this._businessService.getBusinessStats().subscribe((res: any) => {
      this.categories = res.categories;
      // this.serviceAreas = res.service_areas;

      console.log(res,'resees');

    });
  }

  getServiceAreas() {
    this._businessService.getLocations().subscribe((res: any) => {
      this.serviceAreas = res;

      console.log('service areas', this.serviceAreas);

    });
  }

    getCategories() {
    this._businessService.getCategories().subscribe((res: any) => {
      this.categories = res;
      console.log(this.categories, 'categories');
    });
  }


  onServiceListPageChange(newPage: number) {
    this.page.set(newPage);
    this.getBusinessList();
  }

//   onSearchChange() {
//   this.page.set(1); // Reset to first page when searching
//   this.getBusinessList();
// }

onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  displayFilters() {
    this.display_filter = !this.display_filter;
  }
}

