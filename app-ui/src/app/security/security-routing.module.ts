import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { CustomersComponent } from './components/customers/customers.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';
import { ContractsExpiringComponent } from './components/contracts-expiring/contracts-expiring.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SigninLogsComponent } from './components/signin-logs/signin-logs.component';
import { FacilityGroupsComponent } from './components/facility-groups/facility-groups.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      { path: 'facility-groups', component: FacilityGroupsComponent },
      { path: 'contracts', component: ContractsComponent },
      { path: 'expiring-contracts', component: ContractsExpiringComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'facilities', component: FacilitiesComponent },
      { path: 'reset-passwords', component: ResetPasswordComponent },
      { path: 'logs', component: SigninLogsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
