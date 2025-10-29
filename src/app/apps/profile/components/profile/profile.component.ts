import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from '../../../sharedmodule/models/category';
import { CategoryService } from '../../../sharedmodule/services/category/category.service';
import { Service } from '../../../sharedmodule/models/service';
import { ServiceService } from '../../../sharedmodule/services/service/service.service';
import { ActivatedRoute } from '@angular/router';
import { SideBarService } from '../../../sharedmodule/services/side-bar.service';

declare var bootstrap: any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  user_type: string | null;
  profile: any;
  updateProfileForm!: FormGroup;
  updatePasswordForm!: FormGroup;

  update_profile: boolean = false;

  constructor(private profileService: ProfileService, private toastr: ToastrService){
    this.user_type = localStorage.getItem('user_type');
  }

  ngOnInit(): void {

    // if(this.user_type === 'CUSTOMER'){
      this.getUserProfile()
    // }else if(this.user_type === 'BUSINESS'){
      // this.getBusinessProfile()
    // }

    this.updateProfileForm = new FormGroup({
      phone_number: new FormControl('', Validators.required),
      bio: new FormControl('', Validators.required),
    })

    this.updatePasswordForm = new FormGroup({
      current_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    })
  }

  getUserProfile(){
    this.profileService.geUserProfile().subscribe((res:any)=>{
      this.profile = res;
    })
  }

  getBusinessProfile(){
    this.profileService.getBusinessProfile().subscribe((res:any)=>{
      this.profile = res;
    })
  }

  showForm(){
    this.update_profile = !this.update_profile;
  }

  updateProfile(){
    // console.log(this.updateProfileForm.value);
    const data = {
      phone_number: this.updateProfileForm.value.phone_number ? this.updateProfileForm.value.phone_number : this.profile?.phone_number,
      bio: this.updateProfileForm.value.bio ? this.updateProfileForm.value.bio : this.profile?.bio,
    }
    if(this.updateProfileForm.value.phone_number || this.updateProfileForm.value.bio){
      this.profileService.updateUserProfile(data).subscribe((res:any)=>{
        this.updateProfileForm.reset();
        this.update_profile = !this.update_profile;
        this.getUserProfile();
        this.toastr.success('Profile updated successfully');
        },(error:any)=>{
          this.toastr.error('Failed to update profile');
        })
    }else{
      this.update_profile = !this.update_profile;
    }
  }


  updatePassword(){
    const data = {
      old_password: this.updatePasswordForm.value.current_password,
      new_password: this.updatePasswordForm.value.new_password,
      confirm_password: this.updatePasswordForm.value.confirm_password,
    }

    console.log('updatePassword',data);

    this.profileService.updateUserPassword(data).subscribe((res:any)=>{
      this.toastr.success('Password updated successfully');
    },(error:any)=>{

      console.log('error',error);

      this.toastr.error('Failed to update password');
    })
  }
}










//   sidebarActive = false;

// constructor(private elRef: ElementRef) {}

// toggleSidebar() {
//   this.sidebarActive = !this.sidebarActive;
// }

// @HostListener('document:click', ['$event'])
// onDocumentClick(event: MouseEvent) {
//   const sidebar = this.elRef.nativeElement.querySelector('#sidebar');
//   const toggle = this.elRef.nativeElement.querySelector('.mobile-toggle');

//   if (window.innerWidth <= 768 &&
//       !sidebar.contains(event.target) &&
//       !toggle.contains(event.target)) {
//     this.sidebarActive = false;
//   }
// }


  // modalTitle: string = 'Add New Category';
  // serviceModalTitle: string = 'Add New Service';


  // profile:any;
  // updateProfileForm!: FormGroup;
  // categoryForm!: FormGroup;
  // serviceForm!: FormGroup;

  // user_type: any

  // categories$!: Observable<Category[]>;
  // services$!: Observable<Service[]>;

	// categoryTotal$!: Observable<number>;
  // serviceTotal$!: Observable<number>;
  // isloading = false;

  // selectedCategory: any = null;
  // selectedService: any = null;

  // category_id:any
  // service_id:any;

  // categories: any = []
  // business_details:any=[]
  // selectedCategoryId:any

  // business_id:any
  // image: any


  // constructor(
  //   private profileService:ProfileService,
  //   private toastr: ToastrService,
  //   public _categoryService: CategoryService,
  //   public _serviceService:ServiceService,
  //   private route: ActivatedRoute,
  //   private elRef: ElementRef
  // ){
  //   this.user_type = this.route.snapshot.paramMap.get('user_type');

  // }

  // selectedCar: any;
  // searchTerm: string = '';

  // ngOnInit(){

  //   if(this.user_type==='customer'){
  //     this.getUserProfile()
  //   }else if(this.user_type==='business'){
  //     this.getBusinessProfile()
  //     this.loadCategories();

  //   }

  //   this._categoryService.getCategory().subscribe((res) => {
  //     this.categories = res;
  //   });

  //   this.updateProfileForm = new FormGroup(
  //     {
  //       location: new FormControl('', Validators.required),
  //       address: new FormControl('', [Validators.required]),
  //       phone_number: new FormControl('', [
  //         Validators.required,
  //         Validators.minLength(9),
  //         Validators.pattern(/^\d{9}$/),
  //       ]),
  //       city: new FormControl('', Validators.required),
  //       town: new FormControl('', [Validators.required]),
  //       facebook: new FormControl('', Validators.required),
  //       twitter: new FormControl(''),
  //       linkedin: new FormControl(''),
  //       instagram: new FormControl(''),
  //       website: new FormControl(''),
  //       bio: new FormControl(''),

  //     },
  //   );

  //   this.categoryForm = new FormGroup(
  //     {
  //       name:new FormControl('',Validators.required)
  //     }
  //   )

  //   this.serviceForm = new FormGroup(
  //     {
  //       name:new FormControl('',Validators.required),
  //       category:new FormControl('',Validators.required)

  //     }
  //   )
  // }


  // addNewCategory() {
  //   this.resetForm();
  //   this.modalTitle = 'Add New Category';
  //   this.selectedCategory = null;
  // }
  // resetForm() {
  //   this.categoryForm.reset({
  //     name: ''
  //   });
  // }

  // setEditForm(category: any) {
  //   this.category_id = category.id;
  //   this.categoryForm.patchValue({
  //     name: category?.name,

  //   });
  // }

  // editCategory(category: any) {
  //   this.setEditForm(category);
  //   this.modalTitle = 'Edit Category';
  //   this.selectedCategory = category;
  // }


  //  loadCategories() {
  //   this.categories$ = this._categoryService.categories$;
  //   this.categoryTotal$ = this._categoryService.total$;
  //   this.services$ = this._serviceService.services$
  //   this.serviceTotal$ = this._serviceService.total$
  // }

  // submitCategoryForm() {
  //   const modalElement = document.getElementById('basicModal2');
  //   const modalInstance = bootstrap.Modal.getInstance(modalElement);
  //   const data = this.categoryForm.value;

  //   if (this.selectedCategory) {
  //     this.profileService.updateCategory(data,this.category_id).subscribe(
  //       (res: any) => {
  //         this._categoryService._search$.next();
  //         modalInstance.hide();
  //         this.toastr.success('updated added successfully');
  //       },
  //       (error: any) => {
  //         this.toastr.error('Failed to update user details');
  //       }
  //     );
  //   } else {
  //     if (this.categoryForm.valid) {
  //       this.profileService.addCategory(data).subscribe(
  //         (response: any) => {
  //           this.categoryForm.reset()
  //           this._categoryService._search$.next();
  //           modalInstance.hide();
  //           this.toastr.success('Category added successfully');
  //         },
  //         (error: any) => {
  //           this.toastr.error('Failed add category');
  //         }
  //       );
  //     }
  //   }
  // }

  // deleteCategory(){
  //   const modalElement = document.getElementById('basicModal3');
  //   const modalInstance = bootstrap.Modal.getInstance(modalElement);

  //   this.profileService.deleteCategory(this.selectedCategoryId).subscribe((res:any)=>{
  //     this._categoryService._search$.next();
  //     modalInstance.hide();
  //     this.toastr.success('deleted successfully');
  //   }, (error: any) => {
  //     this.toastr.error('An error occurred');
  //   })
  // }

  // resetServiceForm() {
  //   this.serviceForm.reset({
  //     name: '',
  //     category:''
  //   });
  // }

  // setEditServiceForm(service: any) {
  //   let category: any
  //   service?.categories.forEach((element:any) => {
  //     category = element.name
  //   });

  //   this.service_id = service.id;
  //   this.serviceForm.patchValue({
  //     name: service?.name,
  //     category:category

  //   });
  // }

  // editService(service: any) {
  //   this.setEditServiceForm(service);
  //   this.serviceModalTitle = 'Edit Category';
  //   this.selectedService = service;
  // }

  // submitServiceForm(){
  //   const modalElement = document.getElementById('basicModalService');
  //   const modalInstance = bootstrap.Modal.getInstance(modalElement);
  //   if(this.selectedService){
  //     let service_id = this.selectedService.id
  //     const payload = {
  //       name:this.serviceForm.value.name,
  //       category_ids:[this.serviceForm.value.category]
  //     }

  //     this._serviceService.editService(service_id,payload).subscribe((res:any)=>{
  //       this.services$ = this._serviceService.services$
  //       this.toastr.success('added successfully');
  //     })

  //   }else{
  //     const payload = {
  //       name:this.serviceForm.value.name,
  //       category_id:this.serviceForm.value.category
  //     }
  //     this._serviceService.addService(payload).subscribe((res:any)=>{
  //       modalInstance.hide();
  //       this.toastr.success('added successfully');
  //       this.services$ = this._serviceService.services$

  //     },(error: any) => {
  //       this.toastr.error('Failed add service');
  //     })

  //   }
  // }


  // deleteService(){
  //   const modalElement = document.getElementById('basicModal4');
  //   const modalInstance = bootstrap.Modal.getInstance(modalElement);
  //   this._serviceService.deleteService(this.selectedCategoryId).subscribe((res:any)=>{
  //     this.services$ = this._serviceService.services$
  //     modalInstance.hide();
  //     this.toastr.success('deleted successfully');
  //   }, (error: any) => {
  //     this.toastr.error('An error occurred');
  //   })
  // }

  // getUserProfile(){
  //   this.profileService.geUserProfile().subscribe((res:any)=>{
  //     this.profile = res;
  //     console.log(res);
  //   })
  // }

  // getBusinessProfile(){
  //   this.profileService.getBusinessProfile().subscribe((res:any)=>{
  //     this.profile = res;
  //     console.log('getBusinessProfile',res);
  //     this.getProfileImg()
  //     this.getBusinessDetails()
  //   })
  // }


  // getProfileImg(){
  //   this.profileService.getProfileImg().subscribe((res:any)=>{
  //     console.log(res);
  //     this.image = res.image
  //   })
  // }


  // getBusinessDetails(){
  //   this.profileService.getBusiness().subscribe((res:any)=>{
  //     console.log(res);
  //     this.business_details = res
  //     this.business_id = this.business_details['id']
  //   })
  // }

  // createProfile(){
  //   alert('po')
  // }

  // updateProfile(){
  //   let data = {}
  //   if(this.profile.user_type==='CUSTOMER'){
  //     data = {
  //       bio:this.updateProfileForm.value.bio ? this.updateProfileForm.value.bio : this.profile['bio'],
  //     }
  //   }else{
  //     data = {
  //       business_id:this.business_details.id,
  //       bio:this.updateProfileForm.value.bio ? this.updateProfileForm.value.bio : this.profile['bio'],
  //       phone_number: this.updateProfileForm.value.phone_number ? this.updateProfileForm.value.phone_number :this.profile['phone_number'],
  //       location: {
  //         location: this.updateProfileForm.value.location ? this.updateProfileForm.value.location : this.profile['location']['location'],
  //         address: this.updateProfileForm.value.address ? this.updateProfileForm.value.address : this.profile['location']['address'],
  //         town:this.updateProfileForm.value.town ? this.updateProfileForm.value.town : this.profile['location']['town'],
  //         city: this.updateProfileForm.value.city ? this.updateProfileForm.value.city : this.profile['location']['city'],
  //     },
  //     social_media: {
  //         facebook: this.updateProfileForm.value.facebook ? this.updateProfileForm.value.facebook : this.profile['social_media']['facebook'],
  //         twitter: this.updateProfileForm.value.twitter ? this.updateProfileForm.value.twitter : this.profile['social_media']['twitter'],
  //         instagram:this.updateProfileForm.value.instagram ? this.updateProfileForm.value.instagram : this.profile['social_media']['instagram'],
  //         linkedin:this.updateProfileForm.value.linkedin ? this.updateProfileForm.value.linkedin : this.profile['social_media']['linkedin'],
  //         website:this.updateProfileForm.value.website ? this.updateProfileForm.value.website : this.profile['social_media']['website'],
  //     }
  //     }
  //   }

  //   const method = this.user_type === 'business' ? "updateBusinessProfile" : "updateUserProfile";
  //   this.profileService[method](data).subscribe((res:any)=>{
  //     this.user_type === 'business' ? this.getBusinessProfile : this.getUserProfile()
  //     this.toastr.success(`Updated successfully`);

  //   })

  // }

  // trackByCountryId(index: number, category: any): number {
  //   return category.id;
  // }






