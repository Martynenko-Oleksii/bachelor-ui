import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CompareGroupsComponent } from './components/compare-groups/compare-groups.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      { path: 'templates', component: TemplatesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'compare-groups', component: CompareGroupsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
