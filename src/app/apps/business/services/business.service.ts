import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BusinessDetail, FrequentlyAskedQuestion, FrequentlyAskedResult, ServiceAreaResult, ServiceResult } from '../models/business.model';
import { Observable } from 'rxjs';
import { Category } from '../../sharedmodule/models/category';

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
    locations: string[] = [],
    search: string = ''
  ) {
    const token = localStorage.getItem('access_token')?.replace(/^"|"$/g, '');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams().set('page', page).set('page_size', pageSize);

    if (categories.length > 0) {
      params = params.set('categories', categories.join(','));
    }

    if (locations.length > 0) {
      params = params.set('service_areas', locations.join(','));
    }
    if (search.trim() !== '') {
    params = params.set('search', search.trim());
  }

    return this.http.get(`${this.baseUrl}business/business-list/`, {
      headers,
      params,
    });
  }

  getBusinessStats() {
  return this.http.get(`${this.baseUrl}business/stats/`);
}

  getBusinessDetail(id: string): Observable<BusinessDetail> {
    return this.http.get<BusinessDetail>(`${this.baseUrl}business/business-details/${id}`, {
      headers: headers,
    });
  }

  getCategories(): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}service/category/`, {
      headers: headers,
    });
  }

  getFAQS(): Observable<FrequentlyAskedResult> {
    return this.http.get<FrequentlyAskedResult>(`${this.baseUrl}business/frequently-asked-question/`, {
      headers: headers,
    });
  }

  addFAQS(data: FormData): Observable<FrequentlyAskedQuestion> {
    return this.http.post<FrequentlyAskedQuestion>(
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

  updateService(data: FormData, id: string | undefined) {
    return this.http.put(`${this.baseUrl}/business/services/${id}/`, data, {
      headers: headers,
    });
  }

  getServices(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
    category?: number
  ): Observable<ServiceResult> {
    const params: any = {
      page: page,
      page_size: pageSize,
      search: search,
      ordering: 'name',
    };

    if (category) {
      params.category = category;
    }

    return this.http.get<ServiceResult>(`${this.baseUrl}business/services/`, {
      headers,
      params,
    });
  }

  getServiceAreas(
    page: number = 1,
    pageSize: number = 10,
    search: string = ''
  ): Observable<ServiceAreaResult> {
    const params: any = {
      page: page,
      page_size: pageSize,
      search: search,
    };

    return this.http.get<ServiceAreaResult>(`${this.baseUrl}business/service-areas/`, {
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


  getLocations() {
    return this.http.get(`${this.baseUrl}service/location/`, {
      headers: headers,
    });
  }


  updateAvailability(data:any){
    return this.http.patch(`${this.baseUrl}business/availability/`,data, {
      headers: headers
    })
  }





}



