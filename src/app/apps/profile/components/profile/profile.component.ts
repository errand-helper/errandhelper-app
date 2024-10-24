import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from '../../../sharedmodule/models/category';
import { SortableDirective, SortEvent } from '../../../sharedmodule/services/sortable.directive';
import { CategoryService } from '../../../sharedmodule/services/category/category.service';

declare var bootstrap: any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  modalTitle: string = 'Add New Category';


  profile:any;
  updateProfileForm!: FormGroup;
  categoryForm!: FormGroup;
  user_type: any

  categories$!: Observable<Category[]>;
	total$!: Observable<number>;
  selectedCategory: any = null;
  id:any
  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;


  constructor(private profileService:ProfileService,private toastr: ToastrService,public service: CategoryService){
    this.categories$ = service.categories$;
		this.total$ = service.total$;
  }

  // onSort({ column, direction }: SortEvent) {
	// 	this.headers.forEach((header) => {
	// 		if (header.sortable !== column) {
	// 			header.direction = '';
	// 		}
	// 	});

	// 	this.service.sortColumn = column;
	// 	this.service.sortDirection = direction;
	// }

  ngOnInit(){
    this.getProfile()

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
  }

  addNewUser() {
    this.resetForm();
    this.modalTitle = 'Add New User';
    this.selectedCategory = null;
  }

  resetForm() {
    this.categoryForm.reset({
      name: ''
    });
  }

  setEditForm(category: any) {
    this.id = category.id;
    this.categoryForm.patchValue({
      name: category?.name,

    });
  }

  editUser(category: any) {
    this.setEditForm(category);
    this.modalTitle = 'Edit Category';
    this.selectedCategory = category;
  }

  submitForm() {
    const modalElement = document.getElementById('basicModal2');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    const data = this.categoryForm.value;

    if (this.selectedCategory) {
      this.profileService.updateCategory(data,this.id).subscribe(
        (res: any) => {
          this.categories$ = this.service.categories$
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
            this.categories$ = this.service.categories$
            modalInstance.hide();
            this.toastr.success('user added successfully');
          },
          (error: any) => {
            this.toastr.error('Failed add user');
          }
        );
      }
    }
  }
  selectedCategoryId:any

  deleteCategory(){
    const modalElement = document.getElementById('basicModal3');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    this.profileService.deleteCategory(this.selectedCategoryId).subscribe((res:any)=>{
      this.categories$ = this.service.categories$
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
      localStorage.setItem('user_type', JSON.stringify(this.user_type));
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
      this.categories$ = this.service.categories$
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




}
