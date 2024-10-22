import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }

  registerUser(data:any){
   return this.http.post(`${this.baseUrl}register/`,data)
  }

  registerBusiness(data:any){
    return this.http.post(`${this.baseUrl}business/register/`,data)

  }

  loginUser(data:any){
    return this.http.post(`${this.baseUrl}login/`,data)
   }


}


