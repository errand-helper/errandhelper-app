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
    return this.http.get(`${this.baseUrl}business_profile/profiles`, {
      headers: headers,
    });
  }
}
