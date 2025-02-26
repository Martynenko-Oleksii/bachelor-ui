import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data.component';
import { DataMenuItem } from '../shared/services/shared-data.service';
import { PeriodSelectionComponent } from './components/period-selection/period-selection.component';
import { UploadDataComponent } from './components/upload-data/upload-data.component';
import { FileMappingsComponent } from './components/file-mappings/file-mappings.component';
import { CostCentersComponent } from './components/cost-centers/cost-centers.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { CostCentersMappingComponent } from './components/cost-centers-mapping/cost-centers-mapping.component';
import { GlPrMappingComponent } from './components/gl-pr-mapping/gl-pr-mapping.component';
import { ReportingPeriodsComponent } from './components/reporting-periods/reporting-periods.component';

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
      { path: DataMenuItem.CostCentersMapping, component: CostCentersMappingComponent },
      { path: DataMenuItem.GlPrMapping, component: GlPrMappingComponent },
      { path: DataMenuItem.ReportingPeriods, component: ReportingPeriodsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
