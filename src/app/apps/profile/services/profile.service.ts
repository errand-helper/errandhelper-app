import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const authToken = localStorage.getItem('access_token');
const headers = new HttpHeaders().set(
  'Authorization',
  `Bearer ${authToken}`
);

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<any[]>(`${this.baseUrl}profile/`, {
      headers: headers,
    });
  }

  getProfileImg() {
    return this.http.get(`${this.baseUrl}profile/image`, {
      headers: headers,
    });
  }

  updateProfile(data:any){
    return this.http.put(`${this.baseUrl}profile/`, data, {
      headers: headers,
    });
  }

  addCategory(data:any){
    return this.http.post(`${this.baseUrl}service/category/`, data, {
      headers: headers,
    });
  }


}
