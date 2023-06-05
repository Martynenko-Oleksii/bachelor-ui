import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data.component';
import { DataMenuItem } from '../shared/services/shared-data.service';
import { PeriodSelectionComponent } from './components/period-selection/period-selection.component';

const routes: Routes = [
  {
    path: '',
    component: DataComponent,
    children: [
      { path: DataMenuItem.DataPeriod, component: PeriodSelectionComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
