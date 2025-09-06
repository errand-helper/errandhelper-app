import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, RegisterData, RegisterResponse } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }

  signup(data:RegisterData): Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.baseUrl}signup/`,data)
  }

  loginUser(data:LoginResponse): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.baseUrl}login/`,data)
   }


}


