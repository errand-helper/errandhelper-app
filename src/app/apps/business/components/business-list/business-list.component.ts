import { Component, OnInit, signal } from '@angular/core';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css',
})
export class BusinessListComponent implements OnInit {
  business_list: any;
  categories: any;
  display_filter: boolean = true;
  page = signal(1);
  pageSize = signal(2);
  totalServiceItems = signal(0);
  totalServiceAreaItems = signal(0);
  subjects: { id: string; name: string }[] = [];
  selectedCategories: string[] = [];


  constructor(private _businessService: BusinessService) {}

  ngOnInit() {
    this.getBusinessList();
    this.getCategories();
  }

  onServiceCategoryChange(event: any, subjectId: string) {
    const checked = event.target.checked;
    console.log(checked);

    if (checked) {
      if (!this.selectedCategories.includes(subjectId)) {
        this.selectedCategories = [...this.selectedCategories, subjectId];
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== subjectId);
    }
    this.getBusinessList();
  }

  getBusinessList() {
    this._businessService
      .getBusinessList(this.page(), this.pageSize(),this.selectedCategories)
      .subscribe({
        next: (res: any) => {
          this.business_list = res.results;
          console.log(this.business_list);

          this.totalServiceItems.set(res.count);
        },
        error: (err) => console.error('Error loading tutors:', err),
      });
  }


  onServiceListPageChange(newPage: number) {
    this.page.set(newPage);
    this.getBusinessList();
  }

  getCategories() {
    this._businessService.getCategories().subscribe((res: any) => {
      this.categories = res;
      console.log(this.categories, 'categories');
    });
  }

  displayFilters() {
    this.display_filter = !this.display_filter;
  }
}
