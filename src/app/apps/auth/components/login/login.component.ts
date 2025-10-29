import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService:AuthService, private fb: FormBuilder,private toastr: ToastrService,private route: Router,){
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  loginUser(){
    let data = this.loginForm.value
    if(this.loginForm.invalid){
      return
    }
   this.authService.loginUser(data).subscribe((res:LoginResponse)=>{
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('user_type', JSON.stringify(res.role));
    const userTypeString = localStorage.getItem('user_type');
    const userType = userTypeString ? JSON.parse(userTypeString) : null;
    this.toastr.success('Login successful');
    if(userType === 'business'){
      this.route.navigate(['/business']);
    }else if(userType === 'client'){
        this.route.navigate(['/client']);
    }
    },(error)=>{
      this.toastr.error('An error occurred, please try again')
    })
  }

}
