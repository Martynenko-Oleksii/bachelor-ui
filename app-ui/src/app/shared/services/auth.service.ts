import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AuthUser } from '../models/user';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
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
          this.setUser(loginResponse);
        } else {
          this.login();
        }
      });
    
    this.setCurrentUser();
  }

  public login() {
    this.oidcSecurityService.authorize();
  }

  public refreshSession() {
    this.oidcSecurityService.forceRefreshSession().subscribe({
      next: result => this.setUser(result),
      error: _ => this.login()
    });
  }

  public logout() {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => console.log(result));
    this.currentUserSource.next(null);
    localStorage.removeItem('user');
  }

  public saveCurrentUser(user: AuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private setUser(response: LoginResponse) {
    let user = {} as AuthUser;

    user.id = response.userData.sub;
    user.userName = response.userData.name;
    user.token = response.accessToken;
    user.roles = response.userData.role;
    user.customerId = response.userData.customerId;
    user.customer = response.userData.customerName;
    user.lastSignIn = response.userData.lastSignIn;
    user.firstSignIn = !response.userData.confirmed;
    user.email = response.userData.email;
    user.firstName = response.userData.firstName;
    user.lastName = response.userData.lastName;

    this.currentUserSource.next(user);

    this.saveCurrentUser(user);
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
