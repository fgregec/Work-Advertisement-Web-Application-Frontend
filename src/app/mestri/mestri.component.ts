import { Component, OnInit } from '@angular/core';
import { MestriService } from './mestri.service';
import { City } from '../shared/models/city';
import { Mestar } from '../shared/models/mestar';
import { SearchBy } from '../shared/models/search-by';
import { Pagination } from '../shared/models/pagination';
import { County } from '../shared/models/county';
import { Category } from '../shared/models/category';
import axios from 'axios';


@Component({
  selector: 'app-mestri',
  templateUrl: './mestri.component.html',
  styleUrls: ['./mestri.component.scss']
})
export class MestriComponent implements OnInit {
  distance?: string;
  showDistance = false;
  geoLocationSupported = false;

  searchFilters = {
    pageSize: 10,
    currentPage: 1,
  } as SearchBy;
  pagination?: Pagination<Mestar>;
  mestri: Mestar[] = [];

  constructor(private mestarSevice: MestriService) { }

  ngOnInit(): void {
    this.mestarSevice.search(this.searchFilters).subscribe(response => {
      this.getUserLocation(response.data);
      this.mestri = response.data;
      this.pagination = response;
    }
    );
  }

  filterByCity(cities: City[]) {
    this.searchFilters.cities = [];
    this.searchFilters.cities = cities.map(c => c.id);
    this.mestarSevice.search(this.searchFilters).subscribe(response => {
      this.getUserLocation(response.data);
      this.mestri = response.data;
      this.pagination = response;
    });
  }

  filterByCounties(counties: County[]) {
    this.searchFilters.counties = [];
    this.searchFilters.counties = counties.map(c => c.id);
    this.mestarSevice.search(this.searchFilters).subscribe(response => {
      this.getUserLocation(response.data);
      this.mestri = response.data;
      this.pagination = response;
    });
  }

  filterByCategories(categories: Category[]) {
    this.searchFilters.categories = [];
    this.searchFilters.categories = categories.map(c => c.id);
    this.mestarSevice.search(this.searchFilters).subscribe(response => {
      this.getUserLocation(response.data);
      this.mestri = response.data;
      this.pagination = response;
    });
  }

  sort(e: string | undefined) {
    switch (e) {
      case 'AZ':
        this.mestri = this.mestri.sort((a, b) => a.firstName < b.firstName ? -1 : 1);
        break;
      case 'ZA':
        this.mestri = this.mestri.sort((a, b) => a.firstName < b.firstName ? 1 : -1);
        break;
      default:
        this.mestri = this.mestri.sort((a, b) => a.firstName < b.firstName ? -1 : 1);
    }
  }

  searchAsync(input: string) {
    if (input.length == 0)
      this.mestarSevice.search(this.searchFilters).subscribe(response => {
        this.getUserLocation(response.data);
        this.mestri = response.data;
        this.pagination = response;
      });
    else
      this.mestri = this.mestri.filter(m => m.firstName.startsWith(input) || m.lastName.startsWith(input));
  }

  // PRIVATE GEO METHODS
  private async getUserLocation(mestri: Mestar[]): Promise<void> {
    if (navigator.geolocation) {
      mestri.forEach(mestar => {
        this.geoLocationSupported = true;
        navigator.geolocation.getCurrentPosition(async position => {
          const cityName = mestar.city.name;
          const coordinates = await this.getCoordinates(cityName);
          this.calculateDistance(position.coords.latitude, position.coords.longitude, coordinates.lat, coordinates.lng, mestar);
        });
      })
    } else {
      this.geoLocationSupported = false;
    }
  }

  private async getCoordinates(cityName: string): Promise<{ lat: number; lng: number }> {
    const apiKey = '4c9dfb49cd13441684d0d0e87ee87335';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityName)}&key=${apiKey}`;

    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      return {
        lat: response.data.results[0].geometry.lat,
        lng: response.data.results[0].geometry.lng
      };
    } else {
      throw new Error(`No coordinates found for city: ${cityName}`);
    }
  }

  private calculateDistance(latitude: number, longitude: number, zagrebLatitude: number, zagrebLongitude: number, mestar: Mestar): void {
    const earthRadius = 6371; // Earth radius in km
    const dLat = this.degreesToRadians(zagrebLatitude - latitude);
    const dLon = this.degreesToRadians(zagrebLongitude - longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(latitude)) * Math.cos(this.degreesToRadians(zagrebLatitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = earthRadius * c;
    mestar.distance = ` (${(Math.round(distance * 100) / 100).toFixed(0)} km)`;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
