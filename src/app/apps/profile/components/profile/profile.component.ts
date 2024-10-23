import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from '../../../sharedmodule/models/category';
import { SortableDirective, SortEvent } from '../../../sharedmodule/services/sortable.directive';
import { CategoryService } from '../../../sharedmodule/services/category.service';

declare var bootstrap: any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  profile:any;
  updateProfileForm!: FormGroup;
  categoryForm!: FormGroup;
  user_type: any

  categories$!: Observable<Category[]>;
	total$!: Observable<number>;

  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;


  constructor(private profileService:ProfileService,private toastr: ToastrService,public service: CategoryService){
    this.categories$ = service.categories$;
		this.total$ = service.total$;
  }

  onSort({ column, direction }: SortEvent) {
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.service.sortColumn = column;
		this.service.sortDirection = direction;
	}

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

  trackByCountryId(index: number, country: any): number {
    return country.id;
  }




}
