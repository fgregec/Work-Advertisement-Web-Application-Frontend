import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { AlertModule } from 'ngx-bootstrap/alert';
import {MatDividerModule} from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    FilterBarComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    AlertModule.forRoot(),
    MatSlideToggleModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    MatFormFieldModule,
    ],
  exports: [MatAutocompleteModule, FormsModule, ReactiveFormsModule, MatIconModule,MatSelectModule,MatCheckboxModule, FilterBarComponent,MatDividerModule, MatAutocompleteModule, MatPaginatorModule,
    MatSlideToggleModule, AlertModule, ToastrModule, MatFormFieldModule]


})
export class SharedModule { }
