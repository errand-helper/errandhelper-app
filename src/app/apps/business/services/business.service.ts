import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const authToken = localStorage.getItem('access_token');
const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  addBusiness(data: FormData) {
    return this.http.post(`${this.baseUrl}/business/business/`, data, {
      headers: headers,
    });
  }

  updateBusinessInfo(data: FormData, id: string) {
    return this.http.patch(`${this.baseUrl}/business/business/${id}/`, data, {
      headers: headers,
    });
  }

  getLoggedInUserBusinessList() {
    return this.http.get(`${this.baseUrl}business/business/`, {
      headers: headers,
    });
  }

  getBusinessList() {
    return this.http.get(`${this.baseUrl}business/business-list/`, {
      headers: headers,
    });
  }

  getBusinessDetail(id: string) {
    return this.http.get(`${this.baseUrl}business/business-list/${id}`, {
      headers: headers,
    });
  }

  getCategories() {
    return this.http.get(`${this.baseUrl}service/category/`, {
      headers: headers,
    });
  }

  addService(data: FormData) {
    return this.http.post(`${this.baseUrl}/business/services/`, data, {
      headers: headers,
    });
  }

  getServices(
    page: number=1,
    pageSize: number=10,
    search: string='',
    category?: number
  ) {
    const params: any = {
      page: page,
      page_size: pageSize,
      search: search,
      ordering: 'name',
    };

    if (category) {
      params.category = category;
    }

    return this.http.get(`${this.baseUrl}business/services/`, { headers, params });
  }

  deleteService(id:string){
    return this.http.delete(`${this.baseUrl}business/services/${id}`, {
      headers: headers,
    });
  }
}
