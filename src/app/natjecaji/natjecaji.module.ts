import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing/listing.component';
import { NatjecajiComponent} from './landing-page/natjecaji.component';
import { SharedModule } from '../shared/shared.module';
import { NatjecajiRoutingModule } from './natjecaji-routing.module';
import { NatjecajComponent } from './natjecaj/natjecaj.component';

import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NewNatjecajComponent } from './new-natjecaj/new-natjecaj.component';
import { FilePickerModule } from  'ngx-awesome-uploader';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [
    ListingComponent,
    NatjecajiComponent,
    NatjecajComponent,
    NewNatjecajComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    NatjecajiRoutingModule,
    NgxGalleryModule,
    FilePickerModule,
    MatButtonModule
  ]
})
export class NatjecajiModule { }
