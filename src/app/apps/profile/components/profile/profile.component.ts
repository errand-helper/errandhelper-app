import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  profile:any;
  updateProfileForm!: FormGroup;

  constructor(private profileService:ProfileService){}

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
  }



  getProfile(){
    this.profileService.getProfile().subscribe((res:any)=>{
      this.profile = res;
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
    })

  }



}
