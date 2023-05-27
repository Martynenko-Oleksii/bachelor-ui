import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AuthUser } from '../models/user';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSource = new ReplaySubject<AuthUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient,
    private router: Router) { }

  public checkAuth() {
    this.oidcSecurityService.checkAuth()
      .subscribe(loginResponse => {
        if (loginResponse.isAuthenticated) {
          this.setUser(loginResponse.userData?.name, loginResponse.accessToken);
        } else {
          this.login();
        }
      });
    
    this.setCurrentUser();
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  refreshSession() {
    this.oidcSecurityService.forceRefreshSession().subscribe(result => {
      this.setUser(result.userData?.name, result.accessToken);
    }, error => {
      this.login();
    });
  }

  logout() {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => console.log(result));
    this.currentUserSource.next(null);
    localStorage.removeItem('user');
  }

  private setUser(userName: string, token: string) {
    if (!!userName && !!token) {
      let user = {} as AuthUser;

      user.userName = userName;
      user.token = token;

      this.currentUserSource.next(user);

      this.saveCurrentUser(user);
    }
  }

  private saveCurrentUser(user: AuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private setCurrentUser() {
    let user: AuthUser | null
    if (localStorage.getItem('user') != null) {
      user = JSON.parse(localStorage.getItem('user')!);
    } else {
      user = null;
    }

    this.currentUserSource.next(user);
  }

}
