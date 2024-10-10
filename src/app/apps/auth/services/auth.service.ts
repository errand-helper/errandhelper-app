import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  registerUser(data:any){
   return this.http.post(`http://127.0.0.1:8000/register/`,data)
  }
}
