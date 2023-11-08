import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, UrlSerializer } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { County } from 'src/app/shared/models/county';

import { City } from '../../shared/models/city';
import { RegisterUser } from '../../shared/models/registerUser';
import { AccountService } from '../account.service';
import { GeoService } from 'src/app/shared/services/geo.service';
import { Observable, map, startWith } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    county: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
  });

  user?: User;
  cities: City[] = [];
  counties: County[] = [];
  city?: City;
  county?: County;

  isMestar: boolean = false;
  mestar: string = 'meštar';
  korisnik: string = 'korisnik';
  textValue: string = this.korisnik;

  filteredCounties: Observable<County[]> = new Observable<County[]>();
  filteredCities: Observable<City[]> = new Observable<City[]>();

  constructor(private accountService: AccountService, private dataService: GeoService, private toastr: ToastrService, private router: Router, private title: Title) {
    this.title.setTitle('Registracija')
   }

  ngOnInit(): void {
    this.dataService.getCounties().subscribe((counties) => {
      this.counties = counties;

      this.filteredCounties = this.registerForm.controls['county'].valueChanges.pipe(
        startWith(''),
        map((c) => this._filterCounties(c)),
      );
    });
  }

  changeCounty(name: string): void {
    const county = this.counties.find((z) => z.name === name);
    if (county) {
      this.city = undefined;
      this.registerForm.controls['city'].setValue(null);
      this.county = county;

      this.dataService.getCities(county.id).subscribe((cities) => {
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


  onSubmit(): void {
    if (this.city && this.county && this.registerForm.valid) {
      const user = {
        firstName: this.registerForm.controls['firstName'].value,
        lastName: this.registerForm.controls['lastName'].value,
        email: this.registerForm.controls['email'].value,
        password: this.registerForm.controls['password'].value,
        cityID: this.city.id,
        isMestar: this.isMestar
      } as RegisterUser;

      this.accountService.registerUser(user).subscribe({
        next: (token) => {
          console.log(token);
          this.toastr.success('Registracija uspješna!', '', {
            positionClass: 'toast-bottom-right',
          });

          this.router.navigate(['']);
        },
        error: error => {
          {
            this.registerForm.markAllAsTouched();
            this.toastr.error(error.error);
          }
        }
      });
    }
  }

  checkBoxValueChanged() {
    this.isMestar = !this.isMestar;

    if (this.isMestar)
      this.textValue = this.mestar;
    else
      this.textValue = this.korisnik;
  }

  private initalizeCityObservable(cities: City[]) {
    this.cities = cities;

    this.filteredCities = this.registerForm.controls['city'].valueChanges.pipe(
      startWith(''),
      map((c) => this._filterCities(c))
    );
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
}
