import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CompareGroupsComponent } from './components/compare-groups/compare-groups.component';
import { DataSharingContactComponent } from './components/data-sharing-contact/data-sharing-contact.component';

const routes: Routes = [
  { path: '', redirectTo: 'reports', pathMatch: 'full' },
  {
    path: '',
    component: ReportingComponent,
    children: [
      { path: 'templates', component: TemplatesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'compare-groups', component: CompareGroupsComponent },
      { path: 'data-sharing-report', component: DataSharingContactComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
