import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const authToken = localStorage.getItem('access_token');
const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);


@Injectable({
  providedIn: 'root'
})
export class ErrandService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  createNewErrand(data: any) {
    return this.http.post(`${this.baseUrl}/order/errands/`, data, {
      headers: headers,
    });
  }

  getErrands(){
    return this.http.get(`${this.baseUrl}/order/errand-list/`)
  }

}
