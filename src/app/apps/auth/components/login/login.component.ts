import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
   this.authService.loginUser(data).subscribe((res:any)=>{
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('user_type', JSON.stringify(res.role));
    localStorage.setItem('user_id', JSON.stringify(res.id));

    const userTypeString = localStorage.getItem('user_type');
    const userType = userTypeString ? JSON.parse(userTypeString) : null;
    console.log('userType',userType);

    // localStorage.setItem('user_type', res.role);
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
