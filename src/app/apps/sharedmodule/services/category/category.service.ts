import { Injectable, PipeTransform } from '@angular/core';
import { Category } from '../../models/category';
// import { SortColumn, SortDirection } from '../sortable.directive';
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
	categories: Category[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	// sortColumn: SortColumn;
	// sortDirection: SortDirection;
}

// const compare = (v1: string , v2: string ) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function matches(category: Category, term: string, pipe: PipeTransform) {
  term = term.toLowerCase();

  return (
    category.name?.toLowerCase().includes(term)
  );
}

// function sort(categories: Category[], column: SortColumn, direction: string): Category[] {
//   if (direction === '' || column === '') {
//     return categories;
//   } else {
//     return [...categories].sort((a, b) => {
//       const res = compare(a[column], b[column]);
//       return direction === 'asc' ? res : -res;
//     });
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  public _search$ = new Subject<void>();
  private _categories$ = new BehaviorSubject<Category[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  baseUrl: string = environment.baseUrl


  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    // sortColumn: '',
    // sortDirection: '',
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
				this._categories$.next(result.categories);
				this._total$.next(result.total);
			});

		this._search$.next();
  }

  get categories$() {
    return this._categories$.asObservable();
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

  // set sortColumn(sortColumn: SortColumn) {
  //   this._set({ sortColumn });
  // }

  // set sortDirection(sortDirection: SortDirection) {
  //   this._set({ sortDirection });
  // }


  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {


    const {  pageSize, page, searchTerm } = this._state;

    return this.http.get<Category[]>(`${this.baseUrl}service/category/`, { headers }).pipe(
      // tap((data) => {
      //   console.log('Received data from API:', data); // Verify API response
      // }),
      switchMap((data: Category[]) => {

        let _data = data;
        // Sorting
        let categories = _data;
        // console.log(`Sorting by: ${sortColumn} in ${sortDirection} order`);

        // Filtering by search term
        categories = categories.filter((car) => matches(car, searchTerm, this.pipe));
        // console.log('Filtered cars:', categories);

        // Pagination
        const total = categories.length;
        categories = categories.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        // console.log(`Page: ${page}, PageSize: ${pageSize}, Paginated categories:`, categories);

        return of({ categories, total });
      })
    );
  }

  getCategory(){
    return this.http.get<Category[]>(`${this.baseUrl}service/category/`, { headers })
  }



}
