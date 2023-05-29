import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { AppMaterialModule } from '../app-material.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractsComponent } from './components/contracts/contracts.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ContractsCreationComponent } from './components/contracts-creation/contracts-creation.component';


@NgModule({
  declarations: [
    SecurityComponent,
    ContractsComponent,
    DeleteDialogComponent,
    ContractsCreationComponent
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
