import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const authToken = localStorage.getItem('access_token');
const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

@Injectable({
  providedIn: 'root',
})
export class ErrandService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  createNewErrand(data: any) {
    return this.http.post(`${this.baseUrl}/order/errands/`, data, {
      headers: headers,
    });
  }

  getErrands(
    page: number = 1,
    pageSize: number = 10,
    status: string = '',
    search: string = ''
  ) {
    let params = new HttpParams().set('page', page).set('page_size', pageSize);

    if (status !== '') {
      params = params.set('status', status);
    }

    if (search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get(`${this.baseUrl}/order/errand-list/`, {
      headers,
      params,
    });
  }

  getErrandDetails(id:string){
    return this.http.get(`${this.baseUrl}/order/errands/${id}`,{
      headers: headers,
    })
  }
}
