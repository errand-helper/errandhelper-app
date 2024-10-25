import { Injectable, PipeTransform } from '@angular/core';
import { Service } from '../../models/service';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

const authToken = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    });


interface SearchResult {
	categories: Service[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
}

function matches(service: Service, term: string, pipe: PipeTransform) {
  term = term.toLowerCase();
  console.log(service.name?.toLowerCase().includes(term));

  return (
    service.name?.toLowerCase().includes(term)
  );
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _services$ = new BehaviorSubject<Service[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  baseUrl: string = environment.baseUrl


  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
  };

  constructor(private http: HttpClient,private pipe: DecimalPipe) {
    this._search$
			.pipe(
				tap(() => this._loading$.next(true)),
				debounceTime(200),
				switchMap(() => this._search()),
				delay(200),
				tap(() => this._loading$.next(false)),
			)
			.subscribe((result) => {
				this._services$.next(result.categories);
				this._total$.next(result.total);
			});

		this._search$.next();
  }



  get services$() {
    return this._services$.asObservable();
  }

  get total$() {
    return this._total$.asObservable();
  }

  get loading$() {
    return this._loading$.asObservable();
  }

  get page() {
    return this._state.page
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }



  private _search(): Observable<SearchResult> {


    const {  pageSize, page, searchTerm } = this._state;

    return this.http.get<Service[]>(`${this.baseUrl}service/add-service/`, { headers }).pipe(
      switchMap((data: Service[]) => {

        let _data = data;
        // Sorting
        let categories = _data;
        // Filtering by search term
        categories = categories.filter((car) => matches(car, searchTerm, this.pipe));
        // Pagination
        const total = categories.length;
        categories = categories.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
                console.log(`Page: ${page}, PageSize: ${pageSize}, Paginated categories:`, categories);

        return of({ categories, total });
      })
    );
  }


  addService(data:any){
    return this.http.post(`${this.baseUrl}service/add-service/`, data, {
      headers: headers,
    });
  }





}
