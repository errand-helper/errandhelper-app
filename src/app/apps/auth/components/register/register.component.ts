import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private route = inject(Router)

  ngOnInit() {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.pattern(/^\d{9}$/),
        ],
      ],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }


  registerUser() {
    if(this.registerForm.value.password !== this.registerForm.value.confirm_password) {
      this.toastr.error('Passwords do not match');
      return;
    }
    const data = {
        first_name: this.registerForm.value.first_name,
        last_name: this.registerForm.value.last_name,
        phone: this.registerForm.value.phone,
        email: this.registerForm.value.email,
        role: this.registerForm.value.role,
        password: this.registerForm.value.password,
        confirm_password: this.registerForm.value.confirm_password,
      };
    this.authService.signup(data).subscribe(
      (res: any) => {
        console.log(res);
        this.registerForm.reset();
        this.toastr.success(res.message);
        this.route.navigate(['/login']);
      },
      (error: any) => {
        console.log(error);
        this.toastr.error(error.error.message);
      }
    );
  }
}
