import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { AppMaterialModule } from '../app-material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractsComponent } from './components/contracts/contracts.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ContractsCreationComponent } from './components/contracts-creation/contracts-creation.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomersCreationComponent } from './components/customers-creation/customers-creation.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';
import { FacilityCreationComponent } from './components/facility-creation/facility-creation.component';
import { BrowserModule } from '@angular/platform-browser';
import { ContractsExpiringComponent } from './components/contracts-expiring/contracts-expiring.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SigninLogsComponent } from './components/signin-logs/signin-logs.component';


@NgModule({
  declarations: [
    SecurityComponent,
    ContractsComponent,
    DeleteDialogComponent,
    ContractsCreationComponent,
    CustomersComponent,
    CustomersCreationComponent,
    FacilitiesComponent,
    FacilityCreationComponent,
    ContractsExpiringComponent,
    ResetPasswordComponent,
    SigninLogsComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    SharedModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SecurityModule { }
