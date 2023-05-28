import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting.component';
import { TemplatesComponent } from './components/templates/templates.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      { path: 'templates', component: TemplatesComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
