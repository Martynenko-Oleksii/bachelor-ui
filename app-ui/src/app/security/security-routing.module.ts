import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { ContractsComponent } from './components/contracts/contracts.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      { path: 'contracts', component: ContractsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
