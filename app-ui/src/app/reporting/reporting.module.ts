import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { SharedModule } from '../shared/shared.module';
import { AppMaterialModule } from '../app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesComponent } from './components/templates/templates.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CompareGroupsComponent } from './components/compare-groups/compare-groups.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ReportingComponent,
    TemplatesComponent,
    ReportsComponent,
    CompareGroupsComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    SharedModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class ReportingModule { }
