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
  serviceAreas: any = []; // <-- dynamic locations fetched from API if needed
  display_filter: boolean = true;

  page = signal(1);
  pageSize = signal(10);
  totalServiceItems = signal(0);
  totalServiceAreaItems = signal(0);

  selectedCategories: string[] = [];
  selectedLocations: string[] = []; // <-- track selected locations

  constructor(private _businessService: BusinessService,) {}

  ngOnInit() {
    this.getBusinessList();
    this.getCategories();
    this.getServiceAreas();
    this.getBusinessStats();
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

  // onServiceCategoryChange(event: any, categoryId: string) {
  //   const checked = event.target.checked;
  //   if (checked) {
  //     this.selectedCategories = [...this.selectedCategories, categoryId];
  //   } else {
  //     this.selectedCategories = this.selectedCategories.filter(
  //       (id) => id !== categoryId
  //     );
  //   }
  //   this.getBusinessList();
  // }

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
        this.selectedLocations
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

  displayFilters() {
    this.display_filter = !this.display_filter;
  }
}

// export class BusinessListComponent implements OnInit {
//   business_list: any;
//   categories: any;
//   display_filter: boolean = true;
//   page = signal(1);
//   pageSize = signal(2);
//   totalServiceItems = signal(0);
//   totalServiceAreaItems = signal(0);
//   subjects: { id: string; name: string }[] = [];
//   selectedCategories: string[] = [];


//   constructor(private _businessService: BusinessService) {}

//   ngOnInit() {
//     this.getBusinessList();
//     this.getCategories();
//   }

//   onServiceCategoryChange(event: any, subjectId: string) {
//     const checked = event.target.checked;
//     console.log(checked);

//     if (checked) {
//       if (!this.selectedCategories.includes(subjectId)) {
//         this.selectedCategories = [...this.selectedCategories, subjectId];
//       }
//     } else {
//       this.selectedCategories = this.selectedCategories.filter(id => id !== subjectId);
//     }
//     this.getBusinessList();
//   }

//   getBusinessList() {
//     this._businessService
//       .getBusinessList(this.page(), this.pageSize(),this.selectedCategories)
//       .subscribe({
//         next: (res: any) => {
//           this.business_list = res.results;
//           console.log(this.business_list);

//           this.totalServiceItems.set(res.count);
//         },
//         error: (err) => console.error('Error loading tutors:', err),
//       });
//   }


//   onServiceListPageChange(newPage: number) {
//     this.page.set(newPage);
//     this.getBusinessList();
//   }

  // getCategories() {
  //   this._businessService.getCategories().subscribe((res: any) => {
  //     this.categories = res;
  //     console.log(this.categories, 'categories');
  //   });
  // }

  // displayFilters() {
  //   this.display_filter = !this.display_filter;
  // }
// }
