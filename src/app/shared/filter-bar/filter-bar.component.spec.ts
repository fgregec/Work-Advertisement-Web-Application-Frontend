import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterBarComponent } from './filter-bar.component';
import { MestriService } from 'src/app/mestri/mestri.service';
import { GeoService } from '../services/geo.service';
import { of } from 'rxjs';
import { City } from '../models/city';
import { Country } from '../models/country';
import { County } from '../models/county';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;
  let mockMestriService: jasmine.SpyObj<MestriService>;
  let mockGeoService: jasmine.SpyObj<GeoService>;

  beforeEach(() => {
    mockMestriService = jasmine.createSpyObj('MestriService', ['getCategories']);
    mockGeoService = jasmine.createSpyObj('GeoService', ['getCounties', 'getCities']);

    TestBed.configureTestingModule({
      declarations: [FilterBarComponent],
      providers: [
        { provide: MestriService, useValue: mockMestriService },
        { provide: GeoService, useValue: mockGeoService },
      ],
    });

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories, counties, and cities on init', () => {
    mockMestriService.getCategories.and.returnValue(of([]));
    mockGeoService.getCounties.and.returnValue(of([]));
    mockGeoService.getCities.and.returnValue(of([]));

    component.ngOnInit();

    expect(mockMestriService.getCategories).toHaveBeenCalled();
    expect(mockGeoService.getCounties).toHaveBeenCalled();
    expect(mockGeoService.getCities).toHaveBeenCalled();
  });

  it('should emit selected categories', () => {
    spyOn(component.categoriesSelectedEvent, 'emit');

    const mockCategory = { name: 'test', id: '1' };
    component.categories = [mockCategory];
    component.categorySelected('test', true);

    expect(component.categoriesSelectedEvent.emit).toHaveBeenCalledWith([mockCategory]);
  });


  it('should emit selected cities', () => {
    spyOn(component.citiesSelectedEvent, 'emit');
  
    const mockCountry: Country = { id: '1', name: 'Country' };
    const mockCounty: County = { id: '1', name: 'Country'};
  
    const mockCity: City = {
      id: '1',
      name: 'test',
      county: mockCounty,
      zipCode: 12345,
      country: mockCountry,
      countyID: '2'
    };
  
    component.cities = [mockCity];
    component.citySelected('test', true);
  
    expect(component.citiesSelectedEvent.emit).toHaveBeenCalledWith([mockCity]);
  });
});
