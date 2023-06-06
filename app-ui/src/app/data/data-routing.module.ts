import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data.component';
import { DataMenuItem } from '../shared/services/shared-data.service';
import { PeriodSelectionComponent } from './components/period-selection/period-selection.component';
import { UploadDataComponent } from './components/upload-data/upload-data.component';
import { FileMappingsComponent } from './components/file-mappings/file-mappings.component';
import { CostCentersComponent } from './components/cost-centers/cost-centers.component';
import { AccountsComponent } from './components/accounts/accounts.component';

const routes: Routes = [
  {
    path: '',
    component: DataComponent,
    children: [
      { path: DataMenuItem.DataPeriod, component: PeriodSelectionComponent },
      { path: DataMenuItem.UploadData, component: UploadDataComponent },
      { path: DataMenuItem.MappingTemplates, component: FileMappingsComponent },
      { path: DataMenuItem.CostCenters, component: CostCentersComponent },
      { path: DataMenuItem.Accounts, component: AccountsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
