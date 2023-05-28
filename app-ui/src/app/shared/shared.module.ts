import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleMenuComponent } from './components/module-menu/module-menu.component';
import { AppMaterialModule } from '../app-material.module';



@NgModule({
  declarations: [
    ModuleMenuComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  exports: [
    ModuleMenuComponent,
  ]
})
export class SharedModule { }
