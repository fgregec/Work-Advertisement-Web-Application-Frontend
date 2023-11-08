import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { County } from 'src/app/shared/models/county';
import { UpdateUser, User } from 'src/app/shared/models/user';
import { AccountService } from '../account.service';
import { City } from 'src/app/shared/models/city';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { GeoService } from 'src/app/shared/services/geo.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    county: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    password: new FormControl('', Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')),
    confirmPassword: new FormControl(''),
  });

  user?: User;
  cities: City[] = [];
  counties: County[] = [];
  city?: City;
  county?: County;

  filteredCounties: Observable<County[]> = new Observable<County[]>();
  filteredCities: Observable<City[]> = new Observable<City[]>();

  confirmPasswordValid = false;

  constructor(private accountService: AccountService, private dataService: GeoService, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private title: Title, private router: Router) {
    this.title.setTitle('Profil')
   }

  ngOnInit(): void {
    this.accountService.currentUser.subscribe((user) => {
      if(user?.id)
        this.accountService.getProfile(user?.id).subscribe((u) => {
        this.initializeUserFormValues(u);
       
        this.dataService.getCities(u.city.county.id).subscribe((cities) => {
            this.initalizeCityObservable(cities);
          });
        });
      else
        this.router.navigate(['/account/login']);
    })
    

    this.dataService.getCounties().subscribe((counties) => {
      this.counties = counties;

      this.filteredCounties = this.profileForm.controls['county'].valueChanges.pipe(
        startWith(''),
        map((c) => this._filterCounties(c)),
      );
    });
  }

  changeCounty(name: string): void {
    const county = this.counties.find((c) => c.name === name);
    if (this.user && county) {
      this.city = undefined;
      this.profileForm.controls['city'].setValue(null);
      this.county = county;

      this.dataService.getCities(county.id).subscribe((cities) => {
        this.initalizeCityObservable(cities);
      });
    }
  }

  changeCity(name: string){
    if(this.county){
      const city = this.cities.find(c => c.name == name);
      this.city = city ? city : undefined;
    }
  }

  async checkPassword(): Promise<void> {
    this.confirmPasswordValid = this.profileForm.controls['confirmPassword'].value === this.profileForm.controls['password'].value;
  }

  onSubmit(): void {
    if (this.city && this.county) {
      const dto = {
        id: this.user?.id,
        firstName: this.profileForm.controls['firstName'].value,
        lastName: this.profileForm.controls['lastName'].value,
        email: this.profileForm.controls['email'].value,
        password: this.profileForm.controls['password'].value,
        cityID: this.city.id,
        countyID: this.county.id,
      } as UpdateUser;
      this.accountService.updateProfile(dto).subscribe(response => {
        this.toastr.success('Profil uspješno ažuriran');
        this.initializeUserFormValues(response);
      });
    }
  }



  //  PRIVATE FUNCTIONS
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

  private initalizeCityObservable(cities: City[]) {
    this.cities = cities;

    this.filteredCities = this.profileForm.controls['city'].valueChanges.pipe(
      startWith(''),
      map((c) => this._filterCities(c))
    );
  }

  private initializeUserFormValues(u: User): void {
    this.city = u.city;
    this.county = u.city.county;
    this.user = u;
    this.profileForm.controls.firstName.setValue(u.firstName);
    this.profileForm.controls.lastName.setValue(u.lastName);
    this.profileForm.controls.email.setValue(u.email);
    this.profileForm.controls.county.setValue(u.city.county.name);
    this.profileForm.controls.city.setValue(u.city.name);
    this.profileForm.controls.zipCode.setValue(u.city.zipCode.toString());
    this.profileForm.controls['password'].reset();
    this.profileForm.controls.confirmPassword.reset();
  }


}