import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { SharedModule } from '../shared/shared.module';
import { AppMaterialModule } from '../app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportingComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    SharedModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ReportingModule { }
