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
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CompareGroupCreationComponent } from './components/compare-group-creation/compare-group-creation.component';
import { DataSharingContactComponent } from './components/data-sharing-contact/data-sharing-contact.component';


@NgModule({
  declarations: [
    ReportingComponent,
    TemplatesComponent,
    ReportsComponent,
    CompareGroupsComponent,
    DeleteDialogComponent,
    CompareGroupCreationComponent,
    DataSharingContactComponent
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
