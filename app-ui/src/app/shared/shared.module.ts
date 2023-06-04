import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData  } from '@angular/common';
import { ModuleMenuComponent } from './components/module-menu/module-menu.component';
import { AppMaterialModule } from '../app-material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { TranslateDatePipe } from './pipes/translate-date.pipe';
import localeUk from '@angular/common/locales/uk';
import { DetailsPanelComponent } from './components/details-panel/details-panel.component';

registerLocaleData(localeUk);

@NgModule({
  declarations: [
    ModuleMenuComponent,
    TranslateDatePipe,
    DetailsPanelComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  {
    provide: LOCALE_ID,
    useValue: 'uk-UA'
  }],
  exports: [
    ModuleMenuComponent,
    TranslateDatePipe,
    DetailsPanelComponent,
  ]
})
export class SharedModule { }
