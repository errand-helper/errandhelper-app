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
    console.log(res);
    this.toastr.success('Login successful');
    this.route.navigate(['/']);
    },(error)=>{
      console.log(error);
      this.toastr.error('An error occurred, please try again')
      // this.toastr.error(error.error);
    })

  }

}
