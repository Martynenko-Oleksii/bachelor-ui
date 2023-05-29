import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { HomeComponent } from './components/home/home.component';
import { UpdateUserInfoComponent } from './components/update-user-info/update-user-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ScheduleComponent,
    HomeComponent,
    UpdateUserInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      config: {
        authority: environment.authority,
        redirectUrl: environment.redirectUrl,
        postLoginRoute: environment.postLogoutRedirectUri,
        clientId: environment.clientId,
        scope: environment.scope,
        responseType: environment.responseType,
        silentRenew: true,
        useRefreshToken: true,
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
