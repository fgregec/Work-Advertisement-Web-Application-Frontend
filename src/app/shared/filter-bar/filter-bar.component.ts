import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { MestriService } from 'src/app/mestri/mestri.service';
import { Category } from '../models/category';
import { City } from '../models/city';
import { County } from '../models/county';
import { GeoService } from '../services/geo.service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  filterGroup = new FormGroup({
    county: new FormControl('', []),
    city: new FormControl('', []),
    category: new FormControl('', []),
  });

  categories: Category[] = [];
  filteredCategories!: Observable<Category[]>;
  selectedCategories: Category[] = [];
  @Output() categoriesSelectedEvent = new EventEmitter<Category[]>();


  counties: County[] = [];
  filteredCounties!: Observable<County[]>;
  selectedCounties: County[] = [];
  lastSelectedCounty: County[] = [];
  @Output() countiesSelectedEvent = new EventEmitter<County[]>();


  cities: City[] = [];
  filteredCities!: Observable<City[]>;
  selectedCities: City[] = [];
  @Output() citiesSelectedEvent = new EventEmitter<City[]>();

  constructor(private mestriService: MestriService, private geoService: GeoService){}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCounties();
    this.loadCities('03f691bd-e594-4ff7-9ce1-5efe81065883');
  }

  // CHECKBOX METHODS
  categorySelected(categoryName: string, checked: boolean){
    var categoryObj = this.categories.find(category => category.name == categoryName);
    if(categoryObj){
      if(checked){
        this.selectedCategories.push(categoryObj);
      }else{
        this.selectedCategories= this.selectedCategories.filter( c => c.id != categoryObj?.id);
      }
      this.categoriesSelectedEvent.emit(this.selectedCategories);
    }
  }

  countySelected(countyName: string, checked: boolean){
    var countyObj = this.counties.find(county => county.name ==countyName);
    if(countyObj){
      this.loadCities(countyObj.id);
      if(checked){
        this.selectedCounties.push(countyObj);
        this.lastSelectedCounty.push(countyObj);
      }else{
        // REMOVE COUTNY AND ITS SELECTED CITIES
        this.selectedCounties = this.selectedCounties.filter(c => c.id != countyObj?.id);
        this.selectedCities = this.selectedCities.filter(c => c.countyID != countyObj?.id);
        // CHECK FOR THE LAST SELECTED COUNTY AND LOAD ITS CITIES
        const index = this.lastSelectedCounty.indexOf(countyObj);
        this.lastSelectedCounty.splice(index, 1);
          if(this.lastSelectedCounty.length > 0){
            // LOAD LAST SELECTED COUNTY CITIES
            this.loadCities(this.lastSelectedCounty[this.lastSelectedCounty.length - 1].id);
            this.countiesSelectedEvent.emit(this.selectedCounties);
          }
          else
          {
            // NO COUNTIES SELECTED
            this.countiesSelectedEvent.emit(this.selectedCounties);
            this.filteredCities = new Observable<City[]>();
          }
        // REFRESH CITIES AFTER REMOVING COUNTY
        this.citiesSelectedEvent.emit(this.selectedCities);
      }
      this.countiesSelectedEvent.emit(this.selectedCounties);
    }
  }

  citySelected(cityName: string, checked: boolean){
    var cityObj = this.cities.find(city => city.name == cityName);
    if(cityObj){
      if(checked){
        this.selectedCities.push(cityObj);
      }else{
        this.selectedCities = this.selectedCities.filter(c => c.id != cityObj?.id);
      }
      this.citiesSelectedEvent.emit(this.selectedCities);
    }
  }

  // INPUT METHODS
  filterCity(value: string){
    this.filteredCities = this.filterGroup.controls['city'].valueChanges.pipe(
      startWith(value),
      map((c) => c ? this._filter(c, this.cities) : this.cities)
    );
  }

  filterCounty(value: string){
    this.filteredCounties = this.filterGroup.controls['county'].valueChanges.pipe(
      startWith(value),
      map((c) => c ? this._filter(c, this.counties) : this.counties)
    );
  }

  filterCategory(value: string){
    this.filteredCategories = this.filterGroup.controls['category'].valueChanges.pipe(
      startWith(value),
      map((c) => c ? this._filter(c, this.categories) : this.categories)
    );
  }

  isCitySelected(city: City){
    return this.selectedCities.includes(city);
  }

  // PRIVATE METHODS
  private loadCategories() {
    this.mestriService.getCategories().subscribe({
      next: response => {
        this.categories = response;
        this.filteredCategories = this.filterGroup.controls['category'].valueChanges.pipe(
          startWith(''),
          map((c) => c ? this._filter(c, response) : response)
        );
      }
    });
  }

  private loadCounties() {
    this.geoService.getCounties().subscribe({
      next: response => {
        this.counties = response;
        this.filteredCounties = this.filterGroup.controls['county'].valueChanges.pipe(
          startWith(''),
          map((c) => c ? this._filter(c, response) : response)
        );
      }
    });
  }

  private loadCities(countyId: string){
    this.geoService.getCities(countyId).subscribe({
      next: response => {
        this.cities = response;
        this.filteredCities = this.filterGroup.controls['city'].valueChanges.pipe(
          startWith(''),
          map((c) => c ? this._filter(c, response) : response)
        );
      }
    });
  }

  private _filter(name: string, options: any[]): any[] {
    const filterValue = name.toLowerCase();

    return options.filter(option => option.name.toLowerCase().includes(filterValue));
  }


}
