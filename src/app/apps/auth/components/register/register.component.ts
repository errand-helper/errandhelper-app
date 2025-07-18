import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  userTypeForm!: FormGroup;
  customer = false;
  business = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: Router
  ) {}
  ngOnInit() {
    this.userTypeForm = this.fb.group({
      user_type: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      // phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      id_number: ['', [Validators.required, Validators.email]],
      business_name: ['', Validators.required],
      activation_fee: ['', Validators.required],
      registration_number: ['', Validators.required],
      location: ['', Validators.required],
      address: ['', [Validators.required]],
      // phone: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.minLength(9),
      //     Validators.pattern(/^\d{9}$/),
      //   ],
      // ],
      city: ['', Validators.required],
      town: ['', [Validators.required]],
      facebook: ['', Validators.required],
      twitter: [''],
      linkedin: [''],
      instagram: [''],
      website: [''],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });

    this.userTypeForm.get('user_type')?.valueChanges.subscribe((value) => {
      this.customer = value === 'customer';
      this.business = value === 'business';

      this.updateFormValidators();
    });
  }

  // Update form validators based on the selected user type
  updateFormValidators() {
    if (this.business) {
      this.registerForm
        .get('business_name')
        ?.setValidators(Validators.required);
      this.registerForm
        .get('activation_fee')
        ?.setValidators(Validators.required);
      this.registerForm
        .get('registration_number')
        ?.setValidators(Validators.required);
      this.registerForm.get('location')?.setValidators(Validators.required);
      this.registerForm.get('address')?.setValidators(Validators.required);
      this.registerForm.get('city')?.setValidators(Validators.required);
      this.registerForm.get('town')?.setValidators(Validators.required);
      this.registerForm.get('facebook')?.setValidators(Validators.required);
      this.registerForm.get('twitter')?.setValidators(Validators.required);
      this.registerForm.get('linkedin')?.setValidators(Validators.required);
      this.registerForm.get('instagram')?.setValidators(Validators.required);
    } else {
      this.registerForm.get('business_name')?.clearValidators();
      this.registerForm.get('activation_fee')?.clearValidators();
      this.registerForm.get('registration_number')?.clearValidators();
      this.registerForm.get('location')?.clearValidators();
      this.registerForm.get('address')?.clearValidators();
      this.registerForm.get('city')?.clearValidators();
      this.registerForm.get('town')?.clearValidators();
      this.registerForm.get('facebook')?.clearValidators();
      this.registerForm.get('twitter')?.clearValidators();
      this.registerForm.get('linkedin')?.clearValidators();
      this.registerForm.get('instagram')?.clearValidators();


    }

    // Update form controls
    this.registerForm.get('business_name')?.updateValueAndValidity();
    this.registerForm.get('activation_fee')?.updateValueAndValidity();
    this.registerForm.get('registration_number')?.updateValueAndValidity();
    this.registerForm.get('location')?.updateValueAndValidity();
      this.registerForm.get('address')?.updateValueAndValidity();
      this.registerForm.get('city')?.updateValueAndValidity();
      this.registerForm.get('town')?.updateValueAndValidity();
      this.registerForm.get('facebook')?.updateValueAndValidity();
      this.registerForm.get('twitter')?.updateValueAndValidity();
      this.registerForm.get('linkedin')?.updateValueAndValidity();
      this.registerForm.get('instagram')?.updateValueAndValidity();

  }

  registerUser() {
    let data;
    if (this.customer) {
      data = {
        first_name: this.registerForm.value.first_name,
        last_name: this.registerForm.value.last_name,
        id_number: this.registerForm.value.id_number,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        confirm_password: this.registerForm.value.confirm_password,
      };
    } else if (this.business) {
      let location = {
        "location": this.registerForm.value.location,
        "address": this.registerForm.value.address,
        "town": this.registerForm.value.town,
        "city": this.registerForm.value.city
      }
      let social_media = {
        "facebook": this.registerForm.value.facebook,
        "twitter": this.registerForm.value.twitter,
        "instagram": this.registerForm.value.instagram,
        "linkedin": this.registerForm.value.linkedin,
        "website": this.registerForm.value.website
    }
      data = {
        first_name: this.registerForm.value.first_name,
        last_name: this.registerForm.value.last_name,
        id_number: this.registerForm.value.id_number,
        email: this.registerForm.value.email,
        business_name: this.registerForm.value.business_name,
        // activation_fee: this.registerForm.value.activation_fee,
        registration_number: this.registerForm.value.registration_number,
        social_media:social_media,
        location:location,
        password: this.registerForm.value.password,
        confirm_password: this.registerForm.value.confirm_password,
      };
    }
    console.log(data);
    const methodMap = {
      registerUser: this.authService.registerUser.bind(this.authService),
      registerBusiness: this.authService.registerBusiness.bind(
        this.authService
      ),
    };

    const endpoint = this.customer ? 'registerUser' : 'registerBusiness';

    let message = this.customer ? 'User' : 'Business';

    methodMap[endpoint](data).subscribe(
      (res: any) => {
        console.log(res);
        this.registerForm.reset();
        this.toastr.success(`${message} successfully registered`);
        this.route.navigate(['/login']);
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('An error occurred, please try again');
      }
    );
  }
}
