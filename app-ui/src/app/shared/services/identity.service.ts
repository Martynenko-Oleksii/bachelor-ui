import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { AuthUser, ProfileInfo, RegisterInfo, Role, User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private baseApi: string = environment.authority;
  private httpOptions = {};

  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.currentUser$.subscribe(user => {
      if (!!user) {
        this.httpOptions = { headers: new HttpHeaders().append('Authorization', 'Bearer ' + user.token) };
      }
    });
  }

  public setInitilUserInfo(info: ProfileInfo): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.baseApi}/api/Profile/SetInitialUserInfo`,
      info,
      this.httpOptions)
  }

  public updateUserInfo(info: ProfileInfo): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.baseApi}/api/Profile/UpdateProfileInfo`,
      info,
      this.httpOptions)
  }

  public changePassword(info: ProfileInfo): Observable<{ updated: boolean }> {
    return this.http.put<{ updated: boolean }>(`${this.baseApi}/api/Profile/UpdateUserPassword`,
      info,
      this.httpOptions)
  }

  public getUsers(customerId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApi}/api/Users/GetUsersInfo/${customerId}`, this.httpOptions);
  }

  public resetUserPassword(id: string, password: string): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}/api/Users/ResetUserPassword/${id}`, { password: password }, this.httpOptions)
  }

  public registerUser(registerInfo: RegisterInfo): Observable<User> {
    return this.http.post<User>(`${this.baseApi}/api/Users/RegisterUser`, registerInfo, this.httpOptions);
  }

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseApi}/api/Users/GetRoles`, this.httpOptions);
  }

  public getUserRoles(userId: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseApi}/api/Users/GetUserRoles/${userId}`, this.httpOptions);
  }

  public deleteUser(userId: string): Observable<Object> {
    return this.http.delete<Object>(`${this.baseApi}/api/Users/DeleteUser/${userId}`, this.httpOptions);
  }
}
