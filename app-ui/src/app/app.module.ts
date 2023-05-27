import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
