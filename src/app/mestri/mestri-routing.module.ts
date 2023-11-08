import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MestriComponent } from './mestri.component';

const routes: Routes = [
  {path: '', component: MestriComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MestriRoutingModule { }
