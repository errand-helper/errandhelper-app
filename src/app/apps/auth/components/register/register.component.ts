import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private authService:AuthService, private fb: FormBuilder,private toastr: ToastrService){

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
    let data = this.registerForm.value
    // if(this.registerForm.invalid){
    //   return
    // }
    console.log(data);

    // return
   this.authService.registerUser(data).subscribe((res:any)=>{
    console.log(res);
    this.toastr.success('User successfully registered');
    },(error)=>{
      console.log(error);
      this.toastr.error('An error occurred, please try again')
      // this.toastr.error(error.error);
    })

  }

}
