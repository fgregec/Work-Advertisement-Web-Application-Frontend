import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UploaderCaptions } from 'ngx-awesome-uploader';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { MestriService } from 'src/app/mestri/mestri.service';
import { Category } from 'src/app/shared/models/category';
import { City } from 'src/app/shared/models/city';
import { County } from 'src/app/shared/models/county';
import { Natjecaj } from 'src/app/shared/models/natjecaj';
import { GeoService } from 'src/app/shared/services/geo.service';
import { NatjecajService } from '../natjecaj.service';
import { DemoAdapter } from './DemoAdapter';

@Component({
  selector: 'app-new-natjecaj',
  templateUrl: './new-natjecaj.component.html',
  styleUrls: ['./new-natjecaj.component.scss']
})
export class NewNatjecajComponent implements OnInit {

  categories: Category[] = [];
  cities: City[] = [];
  counties: County[] = [];
  category?: Category;
  city?: City;
  county?: County;
  isEmergency = false;

  filteredCategories: Observable<Category[]> = new Observable<Category[]>();
  filteredCounties: Observable<County[]> = new Observable<County[]>();
  filteredCities: Observable<City[]> = new Observable<City[]>();

  natjecajForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    county: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  filePickerAdapter: DemoAdapter;

  constructor(private title: Title, private geoService: GeoService, private mestriService: MestriService, private natjecajService: NatjecajService ,private http: HttpClient
    , private toastr: ToastrService, private router: Router) {
     this.title.setTitle('Novi natječaj');
     this.filePickerAdapter = new DemoAdapter(http);
    }

  ngOnInit(): void {
    this.geoService.getCounties().subscribe((counties) => {
      this.counties = counties;

      this.filteredCounties = this.natjecajForm.controls['county'].valueChanges.pipe(
        startWith(''),
        map((c) => this._filterCounties(c)),
      );
    });

    this.mestriService.getCategories().subscribe((categories) =>
    {
      this.categories = categories;
      this.filteredCategories = this.natjecajForm.controls['category'].valueChanges.pipe(
        startWith(''),
        map((c) => this._filterCategories(c)),
      );
    });
  }

  onSubmit(){
    if(this.natjecajForm.valid){
      console.log(this.category?.id)
      const natjecaj = {
        categoryId: this.category?.id,
        countyId: this.county?.id,
        cityId: this.city?.id,
        description: this.natjecajForm.controls['description'].value,
        isEmergency: this.isEmergency
      } as Natjecaj
      this.natjecajService.createNatjecaj(natjecaj).subscribe(
        () => {
          this.toastr.success('Natječaj uspješno kreiran!');
          this.router.navigate(['/natjecaji']);
        },
        (err) => {
          this.toastr.error('Greška pri kreiranju natječaja!');
        }
      );
    } else{
      this.natjecajForm.markAllAsTouched();
      this.toastr.error('Molimo unesite sve podatke!');
    }
  }

  changeEmergency() {
    this.isEmergency = !this.isEmergency;
  }

  changeCategory(name: string) {
    if (name) {
      const findCategory = this.categories.find(c => c.name == name);
      this.category = findCategory ? findCategory : undefined;
    }
  }

  changeCounty(name: string): void {
    const county = this.counties.find((z) => z.name === name);
    if (county) {
      this.city = undefined;
      this.natjecajForm.controls['city'].setValue(null);
      this.county = county;

      this.geoService.getCities(county.id).subscribe((cities) => {
        this.initalizeCityObservable(cities);
      });
    }
  }

  changeCity(name: string) {
    if (this.county) {
      const city = this.cities.find(c => c.name == name);
      this.city = city ? city : undefined;
    }
  }

  private initalizeCityObservable(cities: City[]) {
    this.cities = cities;
    this.filteredCities = this.natjecajForm.controls['city'].valueChanges.pipe(
      startWith(''),
      map((c) => this._filterCities(c))
    );
  }

  private _filterCategories(value: string | null): Category[] {
    if (!value) return this.categories;
    const filterValue = value.toLowerCase();
    return this.categories.filter((category) => category.name.toLowerCase().includes(filterValue));
  }

  private _filterCounties(value: string | null): County[] {
    if (!value) return this.counties;
    const filterValue = value.toLowerCase();
    return this.counties.filter((county) => county.name.toLowerCase().includes(filterValue));
  }

  private _filterCities(value: string | null): City[] {
    if (!value) return this.cities;
    const filterValue = value.toLowerCase();
    return this.cities.filter((city) => city.name.toLowerCase().includes(filterValue));
  }

  public uploaderCaptions: UploaderCaptions = {
    dropzone: {
      title: 'Povuci i ispusti sliku ovdje',
      or: 'ili',
      browse: 'Pretraži datoteke',
    },
    cropper: {
      crop: '',
      cancel: '',
    },
    previewCard: {
      remove: 'Ukloni',
      uploadError: 'Greška pri prijenosu',
    },
  };

}


