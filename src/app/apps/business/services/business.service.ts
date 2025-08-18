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
export class BusinessService {

  baseUrl = environment.baseUrl


  constructor(private http: HttpClient) { }
  // http://127.0.0.1:8000/business_profile/profiles
  getBusinessList() {
    return this.http.get(`${this.baseUrl}business/businesses/`, {
      headers: headers,
    });
  }

  addBusiness(data: FormData) {
    return this.http.post(`${this.baseUrl}/business/businesses/`, data,{
        headers: headers,
      });
  }

  getBusinessDetail(id:string){
    return this.http.get(`${this.baseUrl}business/businesses/${id}`, {
      headers: headers,
    });
  }

  getCategories(){
    return this.http.get(`${this.baseUrl}service/category/`, {
      headers: headers,
    });
  }

}
