import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';
import { AppMaterialModule } from '../app-material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PeriodSelectionComponent } from './components/period-selection/period-selection.component';
import { UploadDataComponent } from './components/upload-data/upload-data.component';
import { FileMappingsComponent } from './components/file-mappings/file-mappings.component';
import { FileMappingCreationComponent } from './components/file-mapping-creation/file-mapping-creation.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CostCentersComponent } from './components/cost-centers/cost-centers.component';
import { CostCenterCreationComponent } from './components/cost-center-creation/cost-center-creation.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountCreationComponent } from './components/account-creation/account-creation.component';
import { CostCentersMappingComponent } from './components/cost-centers-mapping/cost-centers-mapping.component';
import { CcMappingEditComponent } from './components/cc-mapping-edit/cc-mapping-edit.component';
import { GlPrMappingComponent } from './components/gl-pr-mapping/gl-pr-mapping.component';


@NgModule({
  declarations: [
    DataComponent,
    PeriodSelectionComponent,
    UploadDataComponent,
    FileMappingsComponent,
    FileMappingCreationComponent,
    DeleteDialogComponent,
    CostCentersComponent,
    CostCenterCreationComponent,
    AccountsComponent,
    AccountCreationComponent,
    CostCentersMappingComponent,
    CcMappingEditComponent,
    GlPrMappingComponent
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    SharedModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})
export class DataModule { }
