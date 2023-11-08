import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { count, map, Observable, startWith } from 'rxjs';
import { PaginatedListing } from 'src/app/shared/models/paginatedListing';
import { Category } from '../../shared/models/category';
import { City } from '../../shared/models/city';
import { County } from '../../shared/models/county';
import { Listing } from '../../shared/models/listing';
import { NatjecajParams } from '../../shared/models/natjecajParams';
import { GeoService } from '../../shared/services/geo.service';
import { NatjecajService } from '../natjecaj.service';

@Component({
  selector: 'app-natjecaji',
  templateUrl: './natjecaji.component.html',
  styleUrls: ['./natjecaji.component.scss'],
})
export class NatjecajiComponent implements OnInit{

  paginatedListings: PaginatedListing = {count: 0, data: []};

  cities?: City[];
  counties?: County[];
  categories?: Category[];
  emergency?: boolean;

  sortOptions = ['Najnoviji', 'Bez sortiranja'];
  sortPick: string = '';

  pageSizeOptions = [5, 10, 15];
  selectedPageIndex: number = 1;
  selectedPageSize: number = 5;

  natjecajParams = new NatjecajParams();

  filteredCounties: Observable<County[]> = new Observable<County[]>();
  filteredCities: Observable<City[]> = new Observable<City[]>();
  filteredCategories: Observable<Category[]> = new Observable<Category[]>();

  constructor(private natjecajService: NatjecajService, private geoService: GeoService, private title: Title, private paginator: MatPaginatorIntl) {
    this.title.setTitle('Natječaji');
    paginator.itemsPerPageLabel = 'Natječaja po stranici';
    paginator.nextPageLabel = 'Sljedeća stranica';
    paginator.previousPageLabel = 'Prethodna stranica';
    
  }

  ngOnInit(): void {
    this.natjecajService.getFilteredListings(this.natjecajParams).subscribe((listings) => {
      this.paginatedListings = listings ?? {count: 0, data: []};
      this.paginatedListings.data.sort((a,b) => a.id.localeCompare(b.id));
    });;
  }

  filterData(): void {
    this.natjecajParams = {
      emergency: this.emergency ?? false,
      categories: this.categories ? this.categories : [],
      counties: this.counties ? this.counties : [],
      cities: this.cities ? this.cities : [],
      pageIndex: this.selectedPageIndex,
      pageSize: this.selectedPageSize,
    }
    this.natjecajService.getFilteredListings(this.natjecajParams).subscribe((listings) => {
      this.paginatedListings = listings ?? {count: 0, data: []};
      this.changeSort(this.sortPick);
    });
  }

  changeEmergencyValue(): void{
    this.emergency = !this.emergency;
    this.filterData();
  }

  filterByCategory(categories: Category[]): void{
    if(categories.length == 0){
      this.categories = undefined;
      this.filterData();
      return;
    }
    this.categories = categories;
    this.filterData();
  }

  filterByCounty(counties: County[]) {
    if(counties.length == 0){
      this.counties = undefined;
      this.cities = undefined;
      this.filterData();
      return;
    }
    this.counties = counties;
    this.filterData();
  }
  filterByCity(cities: City[]) {
    if (cities.length == 0) {
      this.cities = undefined;
      this.filterData();
    }
    this.cities = cities;
    this.filterData();
  }


  changeSort(name: string): void{
    switch (name) {
      case 'Najnoviji':
        this.sortPick = 'Najnoviji';
        this.paginatedListings.data.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        break;
      case 'Bez sortiranja':
        this.sortPick = 'Bez sortiranja';
        this.paginatedListings.data.sort((a,b) => a.id.localeCompare(b.id));
        break;
    }
  }

  onPageChanged(event: PageEvent){
    this.selectedPageIndex = event.pageIndex + 1;
    this.selectedPageSize = event.pageSize;
    this.filterData();
  }
}
