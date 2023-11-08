import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchBy } from '../shared/models/search-by';
import { Category } from '../shared/models/category';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Mestar } from '../shared/models/mestar';
import { Pagination } from '../shared/models/pagination';

@Injectable()
export class MestriService {
  private baseUrl = "http://localhost:5001/api/Mestar";
  private _categories = new BehaviorSubject<Category[]>([]);
  public readonly categories$ = this._categories.asObservable();


  constructor(private http: HttpClient) { }

  search(searchOptions: SearchBy): Observable<Pagination<Mestar>> {
    let params = new HttpParams()
      .set('Name', searchOptions.name || '')
      .set('CurrentPage', searchOptions.currentPage.toString())
      .set('PageSize', searchOptions.pageSize.toString());
  
      if (searchOptions.cities && searchOptions.cities.length > 0) {
        searchOptions.cities.forEach(city => {
          params = params.append('Cities', city);
        });
      }
  
      if (searchOptions.counties && searchOptions.counties.length > 0) {
        searchOptions.counties.forEach(county => {
          params = params.append('Counties', county);
        });
      }
  
      if (searchOptions.categories && searchOptions.categories.length > 0) {
        searchOptions.categories.forEach(category => {
          params = params.append('Categories', category);
        });
      }
  
    return this.http.get<Pagination<Mestar>>(`${this.baseUrl}/search`, { params });
  }

  getCategories(): Observable<Category[]> {
    if (this._categories.getValue().length > 0) {
      return of(this._categories.getValue());
    }

    return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
      map(response => {
        this._categories.next(response);
        return response;
      })
    );
  }
}