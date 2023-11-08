import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { Listing } from 'src/app/shared/models/listing';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent    {
  @Input() listing! : Listing;

  constructor(private router: Router) {}

  goToDetails(listing: Listing) {
    this.router.navigate([`/natjecaji/details/${listing.id}`], {state: {listing}});
  }
}


