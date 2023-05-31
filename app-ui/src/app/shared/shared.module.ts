import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleMenuComponent } from './components/module-menu/module-menu.component';
import { AppMaterialModule } from '../app-material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '../interceptors/error.interceptor';



@NgModule({
  declarations: [
    ModuleMenuComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }],
  exports: [
    ModuleMenuComponent,
  ]
})
export class SharedModule { }
