import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reporting',
        loadChildren: () => import('./reporting/reporting.module').then(m => m.ReportingModule),
      }
    ]
  },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
