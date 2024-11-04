import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from '../../../sharedmodule/models/category';
// import { SortableDirective, SortEvent } from '../../../sharedmodule/services/sortable.directive';
import { CategoryService } from '../../../sharedmodule/services/category/category.service';
import { Service } from '../../../sharedmodule/models/service';
import { ServiceService } from '../../../sharedmodule/services/service/service.service';

declare var bootstrap: any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  modalTitle: string = 'Add New Category';
  serviceModalTitle: string = 'Add New Service';


  profile:any;
  updateProfileForm!: FormGroup;
  categoryForm!: FormGroup;
  serviceForm!: FormGroup;

  user_type: any

  categories$!: Observable<Category[]>;
  services$!: Observable<Service[]>;

	categoryTotal$!: Observable<number>;
  serviceTotal$!: Observable<number>;
  isloading = false;

  selectedCategory: any = null;
  selectedService: any = null;

  category_id:any
  service_id:any;

  categories: any = []
  business_details:any=[]
  selectedCategoryId:any


  constructor(private profileService:ProfileService,private toastr: ToastrService,public _categoryService: CategoryService,public _serviceService:ServiceService){

  }

  selectedCar: any;
  searchTerm: string = '';
  // cars = [
  //   { id: 1, name: 'Toyota' },
  //   { id: 2, name: 'Honda' },
  //   { id: 3, name: 'Ford' },
  //   // Add more car objects here
  // ];
  // filteredCars = [...this.cars];


  // onSearch(searchTerm: string): void {
  //   this.filteredCars = this.cars.filter(car =>
  //     car.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }


  ngOnInit(){
    this.getProfile()
    this.categories$ = this._categoryService.categories$;
		this.categoryTotal$ = this._categoryService.total$;

    this.services$ = this._serviceService.services$
    this.serviceTotal$ = this._serviceService.total$

    this._categoryService.getCategory().subscribe((res) => {
      this.categories = res;
    });

    this.updateProfileForm = new FormGroup(
      {
        location: new FormControl('', Validators.required),
        address: new FormControl('', [Validators.required]),
        phone_number: new FormControl('', [
          Validators.required,
          Validators.minLength(9),
          Validators.pattern(/^\d{9}$/),
        ]),
        city: new FormControl('', Validators.required),
        town: new FormControl('', [Validators.required]),
        facebook: new FormControl('', Validators.required),
        twitter: new FormControl(''),
        linkedin: new FormControl(''),
        instagram: new FormControl(''),
        website: new FormControl(''),
        bio: new FormControl(''),

      },
    );

    this.categoryForm = new FormGroup(
      {
        name:new FormControl('',Validators.required)
      }
    )

    this.serviceForm = new FormGroup(
      {
        name:new FormControl('',Validators.required),
        category:new FormControl('',Validators.required)

      }
    )
  }

    // category
  addNewCategory() {
    this.resetForm();
    this.modalTitle = 'Add New Category';
    this.selectedCategory = null;
  }
  resetForm() {
    this.categoryForm.reset({
      name: ''
    });
  }

  setEditForm(category: any) {
    this.category_id = category.id;
    this.categoryForm.patchValue({
      name: category?.name,

    });
  }

  editCategory(category: any) {
    this.setEditForm(category);
    this.modalTitle = 'Edit Category';
    this.selectedCategory = category;
  }

  // category

  addNewService() {
    this.resetServiceForm();
    this.serviceModalTitle = 'Add New Service';
    this.selectedService = null;
  }

  resetServiceForm() {
    this.serviceForm.reset({
      name: '',
      category:''
    });
  }

  setEditServiceForm(service: any) {
    let category: any
    service?.categories.forEach((element:any) => {
      category = element.name
    });

    this.service_id = service.id;
    this.serviceForm.patchValue({
      name: service?.name,
      category:category

    });
  }

  editService(service: any) {
    this.setEditServiceForm(service);
    this.serviceModalTitle = 'Edit Category';
    this.selectedService = service;
  }

  submitServiceForm(){
    const modalElement = document.getElementById('basicModalService');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if(this.selectedService){
      let service_id = this.selectedService.id
      const payload = {
        name:this.serviceForm.value.name,
        category_ids:[this.serviceForm.value.category]
      }

      this._serviceService.editService(service_id,payload).subscribe((res:any)=>{
        this.services$ = this._serviceService.services$
        this.toastr.success('added successfully');
      })

    }else{
      const payload = {
        name:this.serviceForm.value.name,
        category_id:this.serviceForm.value.category
      }
      this._serviceService.addService(payload).subscribe((res:any)=>{
        modalInstance.hide();
        this.toastr.success('added successfully');
        this.services$ = this._serviceService.services$

      },(error: any) => {
        this.toastr.error('Failed add service');
      })

    }
  }





  submitForm() {
    const modalElement = document.getElementById('basicModal2');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    const data = this.categoryForm.value;

    if (this.selectedCategory) {
      this.profileService.updateCategory(data,this.category_id).subscribe(
        (res: any) => {
          modalInstance.hide();
          this.toastr.success('updated added successfully');
        },
        (error: any) => {
          this.toastr.error('Failed to update user details');
        }
      );
    } else {
      if (this.categoryForm.valid) {
        this.profileService.addCategory(data).subscribe(
          (response: any) => {
            this.categoryForm.reset()
            modalInstance.hide();
            this.toastr.success('user added successfully');
          },
          (error: any) => {
            this.toastr.error('Failed add category');
          }
        );
      }
    }
  }

  deleteCategory(){
    const modalElement = document.getElementById('basicModal3');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    this.profileService.deleteCategory(this.selectedCategoryId).subscribe((res:any)=>{
      this.categories$ = this._categoryService.categories$
      modalInstance.hide();
      this.toastr.success('deleted successfully');
    }, (error: any) => {
      this.toastr.error('An error occurred');
    })
  }

  deleteService(){
    const modalElement = document.getElementById('basicModal4');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    // alert('ok')
    this._serviceService.deleteService(this.selectedCategoryId).subscribe((res:any)=>{
      // this.categories$ = this._categoryService.categories$
      this.services$ = this._serviceService.services$
      // this.serviceTotal$ = this._serviceService.total$
      modalInstance.hide();
      this.toastr.success('deleted successfully');
    }, (error: any) => {
      this.toastr.error('An error occurred');
    })
  }

  getProfile(){
    this.profileService.getProfile().subscribe((res:any)=>{
      this.profile = res;
      this.user_type = this.profile['user_type']
      if(this.user_type ==='BUSINESS'){
        this.getBusinessDetails()
      }
      // localStorage.setItem('user_type', JSON.stringify(this.user_type));
    })
  }

  business_id:any

  getBusinessDetails(){
    this.profileService.getBusiness().subscribe((res:any)=>{
      console.log(res);
      this.business_details = res
      this.business_id = this.business_details['id']
      // localStorage.setItem('business_id',this.business_id)
    })
  }

  updateProfile(){

    let data = {
      bio:this.updateProfileForm.value.bio,
      phone_number: this.updateProfileForm.value.phone_number,
      location: {
        location: this.updateProfileForm.value.location,
        address: this.updateProfileForm.value.address,
        town:this.updateProfileForm.value.town,
        city: this.updateProfileForm.value.city,
    },
    social_media: {
        facebook: this.updateProfileForm.value.facebook,
        twitter: this.updateProfileForm.value.twitter,
        instagram:this.updateProfileForm.value.instagram,
        linkedin:this.updateProfileForm.value.linkedin,
        website:this.updateProfileForm.value.website,
    }
    }
    console.log(data);
    this.profileService.updateProfile(data).subscribe((res:any)=>{
      console.log(res);
      this.getProfile()
      this.toastr.success(`Updated successfully`);

    })

  }

  addCategory(){
    const modalElement = document.getElementById('basicModal2');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    this.profileService.addCategory(this.categoryForm.value).subscribe((res:any)=>{
      this.categoryForm.reset()
      this.categories$ = this._categoryService.categories$
      modalInstance.hide();
      this.toastr.success('Category added successfully');
    },(error: any) => {
      console.log(error);
      this.toastr.error('An error occurred, please try again');
    })


  }

  trackByCountryId(index: number, category: any): number {
    return category.id;
  }

  // addService(){
  //   console.log(this.serviceForm.value);

  // }




}
