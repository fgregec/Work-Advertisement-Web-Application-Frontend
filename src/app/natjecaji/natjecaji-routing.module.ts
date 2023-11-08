import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NatjecajiComponent } from './landing-page/natjecaji.component';
import { NatjecajComponent } from './natjecaj/natjecaj.component';
import { NewNatjecajComponent } from './new-natjecaj/new-natjecaj.component';



const routes: Routes = [
  {path: '', component: NatjecajiComponent},
  {path: 'details/:id', component: NatjecajComponent},
  {path: 'new', component: NewNatjecajComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NatjecajiRoutingModule { }
