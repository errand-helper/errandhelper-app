import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  profile:any;
  updateProfileForm!: FormGroup;
  categoryForm!: FormGroup;
  constructor(private profileService:ProfileService,private toastr: ToastrService){}

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

  user_type: any

  getProfile(){
    this.profileService.getProfile().subscribe((res:any)=>{
      this.profile = res;

      this.user_type = this.profile['user_type']
      console.log(this.user_type);
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
    this.profileService.addCategory(this.categoryForm.value).subscribe((res:any)=>{
      console.log(res);
      this.categoryForm.reset()
      this.toastr.success('Category added successfully');
    },(error: any) => {
      console.log(error);
      this.toastr.error('An error occurred, please try again');
    })


  }



}
