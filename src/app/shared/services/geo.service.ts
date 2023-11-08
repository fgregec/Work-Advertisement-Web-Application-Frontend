import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/city';
import { County } from '../models/county';
import { Observable, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private baseUrl = "http://localhost:5001/api/Data";
  counties: County[] = [];
  cities = new Map<string, City[]>;

  constructor(private http: HttpClient) { }

  getCounties(): Observable<County[]>{
    if(this.counties.length > 0)
      return of(this.counties);

    return this.http.get<County[]>(`${this.baseUrl}/counties`).pipe(
      map(response => {
        this.counties = response;
        return response;
      })
    );
  }

  getCities(countyId: string): Observable<City[]>{
    const countyCities = this.cities.get(countyId);
    if(countyCities && countyCities.length > 0)
      return of(countyCities);

    return this.http.get<City[]>(`${this.baseUrl}/cities?countyId=${countyId}`).pipe(
      map(response => {
        this.cities.set(countyId, response);
        return response;
      })
    );
  }

}
