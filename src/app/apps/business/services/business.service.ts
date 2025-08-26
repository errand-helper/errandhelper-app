import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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


  getBusinessList(
    page: number = 1,
    pageSize: number = 10,
    categories: string[] = [],
  ) {
    const token = localStorage.getItem('access_token')?.replace(/^"|"$/g, '');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams().set('page', page).set('page_size', pageSize);

    if (status) params = params.set('status', status);

    // Ensure unique categories
    const uniqueCategories = [...new Set(categories)];
    uniqueCategories.forEach((id) => {
      params = params.append('categories', id.toString());
    });

    return this.http.get(`${this.baseUrl}business/business-list/`, {
      headers,
      params,
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

  getFAQS() {
    return this.http.get(`${this.baseUrl}business/frequently-asked-question/`, {
      headers: headers,
    });
  }

  addFAQS(data: FormData) {
    return this.http.post(
      `${this.baseUrl}/business/frequently-asked-question/`,
      data,
      {
        headers: headers,
      }
    );
  }

  addService(data: FormData) {
    return this.http.post(`${this.baseUrl}/business/services/`, data, {
      headers: headers,
    });
  }

  updateService(data: FormData, id: string) {
    return this.http.put(`${this.baseUrl}/business/services/${id}/`, data, {
      headers: headers,
    });
  }

  getServices(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
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

    return this.http.get(`${this.baseUrl}business/services/`, {
      headers,
      params,
    });
  }

  getServiceAreas(
    page: number = 1,
    pageSize: number = 10,
    search: string = ''
  ) {
    const params: any = {
      page: page,
      page_size: pageSize,
      search: search,
    };

    return this.http.get(`${this.baseUrl}business/service-areas/`, {
      headers,
      params,
    });
  }

  addServiceArea(data: any) {
    return this.http.post(`${this.baseUrl}/business/service-areas/`, data, {
      headers: headers,
    });
  }

  deleteService(id: string) {
    return this.http.delete(`${this.baseUrl}business/services/${id}`, {
      headers: headers,
    });
  }
}
