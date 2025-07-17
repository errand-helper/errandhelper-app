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

  geUserProfile() {
    return this.http.get<any[]>(`${this.baseUrl}profile/`, {
      headers: headers,
    });
  }

  getBusinessProfile(){
    return this.http.get<any[]>(`${this.baseUrl}business_profile/`, {
      headers: headers,
    });
  }
  getBusiness(){
    return this.http.get<any[]>(`${this.baseUrl}business/details`, {
      headers: headers,
    });
  }

  getProfileImg() {
    return this.http.get(`${this.baseUrl}profile/image`, {
      headers: headers,
    });
  }

  updateUserProfile(data:any){
    return this.http.patch(`${this.baseUrl}profile/`, data, {
      headers: headers,
    });
  }
  // updateBusinessProfile(data:any){
  //   return this.http.put(`${this.baseUrl}business_profile/update/`, data, {
  //     headers: headers,
  //   });
  // }

  addCategory(data:any){
    return this.http.post(`${this.baseUrl}service/category/`, data, {
      headers: headers,
    });
  }

  updateCategory(data:any,id:any){
    return this.http.put(`${this.baseUrl}service/category/${id}/`, data, {
      headers: headers,
    });
  }

  deleteCategory(id:any){
    return this.http.delete(`${this.baseUrl}service/category/${id}/`, {
      headers: headers,
    });
  }

  getBusinessDetails(id:any){
    return this.http.get(`${this.baseUrl}business/details/${id}`, {
      headers: headers,
    });
  }


}
