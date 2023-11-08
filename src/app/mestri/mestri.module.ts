import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MestriRoutingModule } from './mestri-routing.module';
import { MestriComponent } from './mestri.component';
import { MestarItemComponent } from './mestar-item/mestar-item.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MestriComponent, MestarItemComponent],
  imports: [
    CommonModule,
    MestriRoutingModule,
    SharedModule
  ]
})
export class MestriModule { }
