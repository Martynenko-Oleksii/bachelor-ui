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


@NgModule({
  declarations: [
    DataComponent,
    PeriodSelectionComponent,
    UploadDataComponent,
    FileMappingsComponent,
    FileMappingCreationComponent,
    DeleteDialogComponent,
    CostCentersComponent,
    CostCenterCreationComponent
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
