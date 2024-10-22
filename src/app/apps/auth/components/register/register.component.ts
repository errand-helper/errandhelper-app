import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  userTypeForm!: FormGroup;
  customer = false;
  business = false;

  constructor(private authService:AuthService, private fb: FormBuilder,private toastr: ToastrService,private route:Router){

  }
  ngOnInit() {
    this.userTypeForm = this.fb.group({
      user_type: ['', Validators.required],
    });


    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      business_name: ['', Validators.required],
      activation_fee: ['', Validators.required],
      registration_number: ['', Validators.required],
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
      this.registerForm.get('business_name')?.setValidators(Validators.required);
      this.registerForm.get('activation_fee')?.setValidators(Validators.required);
      this.registerForm.get('registration_number')?.setValidators(Validators.required);
    } else {
      this.registerForm.get('business_name')?.clearValidators();
      this.registerForm.get('activation_fee')?.clearValidators();
      this.registerForm.get('registration_number')?.clearValidators();
    }

    // Update form controls
    this.registerForm.get('business_name')?.updateValueAndValidity();
    this.registerForm.get('activation_fee')?.updateValueAndValidity();
    this.registerForm.get('registration_number')?.updateValueAndValidity();
  }


  registerUser(){
    let data
    if(this.customer){
      data = {
        first_name:this.registerForm.value.first_name,
        last_name:this.registerForm.value.last_name,
        phone:this.registerForm.value.phone,
        email:this.registerForm.value.email,
        password:this.registerForm.value.password,
        confirm_password:this.registerForm.value.confirm_password,
      }
    }else if(this.business){
      data = {
        first_name:this.registerForm.value.first_name,
        last_name:this.registerForm.value.last_name,
        phone:this.registerForm.value.phone,
        email:this.registerForm.value.email,
        business_name:this.registerForm.value.business_name,
        activation_fee:this.registerForm.value.activation_fee,
        registration_number:this.registerForm.value.registration_number,
        password:this.registerForm.value.password,
        confirm_password:this.registerForm.value.confirm_password,
      }
    }
    console.log(data);
    const methodMap = {
      registerUser: this.authService.registerUser.bind(this.authService),
      registerBusiness: this.authService.registerBusiness.bind(this.authService),
    };


    const endpoint = this.customer ? 'registerUser' : 'registerBusiness';

    let message = this.customer ? 'User' : 'Business'

    methodMap[endpoint](data).subscribe(
      (res: any) => {
        console.log(res);
        this.registerForm.reset()
        this.toastr.success(`${message} successfully registered`);
        this.route.navigate(['/authentication/login'])
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('An error occurred, please try again');
      }
    );


  }

}
