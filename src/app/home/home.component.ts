import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MestriService } from '../mestri/mestri.service';
import { Router } from '@angular/router';
import { SearchBy } from '../shared/models/search-by';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchForm = new FormGroup({
    searchBy: new FormControl('')
  });

  selected = 'ime';
  searchPlaceholder = 'Ivan Horvat';

  constructor(private mestarService: MestriService, private router: Router){}


  searchFilterChange(name: string){
    switch (name) {
      case 'grad':
        this.searchPlaceholder = 'Zagreb'
        break;
        case 'zanat':
          this.searchPlaceholder = 'Električar'
          break;
      default:
        this.searchPlaceholder = 'Ivan Horvat'
        break;
    }
  }

  search(){
    if(this.searchForm.controls['searchBy'].value){
      this.mestarService.search({} as SearchBy);
      this.router.navigate(['/mestri']);
    }
  }

}
