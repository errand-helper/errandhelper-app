import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;

  constructor(private authService:AuthService, private fb: FormBuilder,private toastr: ToastrService){
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  registerUser(){
    let data = this.registerForm.value
    if(this.registerForm.invalid){
      return
    }
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
