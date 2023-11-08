import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Category } from '../shared/models/category';
import { PaginatedListing } from '../shared/models/paginatedListing';
import { NatjecajParams } from '../shared/models/natjecajParams';
import { Offer } from '../shared/models/offer';
import { Listing } from '../shared/models/listing';
import { Natjecaj } from '../shared/models/natjecaj';

@Injectable({
  providedIn: 'root'
})
export class NatjecajService {

  private natjecajUrl = 'http://localhost:5001/api/Natjecaj';
  private dataUrl = 'http://localhost:5001/api/Data';
  private offerUrl = 'http://localhost:5001/api/Offer';


  constructor(private http: HttpClient) { }

  getCategories(){
    return this.http.get<Category[]>(this.dataUrl + '/categories');
  }

  getFilteredListings(natjecajParams: NatjecajParams){
    let params = new HttpParams();

    //FILTERS

    if(natjecajParams.emergency !== null){
      params = params.append('emergency', natjecajParams.emergency);
    }
    if(natjecajParams.categories.length !== 0){
      natjecajParams.categories.forEach(category => {params = params.append('categories', category.id.toString())});
     }
    if(natjecajParams.counties.length !== 0){
      natjecajParams.counties.forEach(county => {params = params.append('counties', county.id.toString())});
    }
    if(natjecajParams.cities.length !== 0){
      natjecajParams.cities.forEach(city => {params = params.append('cities', city.id.toString())});
    }

    //PAGINATION

    if(natjecajParams.pageIndex !== null){
      params = params.append('pageIndex', natjecajParams.pageIndex.toString());
    }else{
      params = params.append('pageIndex', 1);
    }

    if(natjecajParams.pageSize !== null){
      params = params.append('pageSize', natjecajParams.pageSize.toString());
    } else {
      params = params.append('pageSize', 5);
    }

    return this.http.get<PaginatedListing>(this.natjecajUrl + '/search', { observe: 'response', params })
      .pipe(map(response => {return response.body;}));
    }

  checkApplied(natjecajId: string){
    return this.http.get<boolean>(`${this.offerUrl+'/checkifapplied'}?natjecajId=${natjecajId}`);
  }

  createOffer(offer: Offer){
    return this.http.post<Offer>(this.offerUrl, offer);
  }

  getListing(natjecajId: string){
    return this.http.get<Listing>(`${this.natjecajUrl +'/details'}?natjecajId=${natjecajId}`);
  }

  createNatjecaj(natjecaj: Natjecaj){
    return this.http.post<Natjecaj>(this.natjecajUrl, natjecaj);
  }
}
