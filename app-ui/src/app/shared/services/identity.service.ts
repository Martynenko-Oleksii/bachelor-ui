import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { AuthUser, ProfileInfo } from '../models/user';
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
    console.log(this.httpOptions);
    return this.http.put<{ updated: boolean }>(`${this.baseApi}/api/Profile/SetInitialUserInfo`,
      info,
      this.httpOptions)
  }

  public updateUserInfo(info: ProfileInfo): Observable<{ updated: boolean }> {
    console.log(this.httpOptions);
    return this.http.put<{ updated: boolean }>(`${this.baseApi}/api/Profile/UpdateProfileInfo`,
      info,
      this.httpOptions)
  }

  public changePassword(info: ProfileInfo): Observable<{ updated: boolean }> {
    console.log(this.httpOptions);
    return this.http.put<{ updated: boolean }>(`${this.baseApi}/api/Profile/UpdateUserPassword`,
      info,
      this.httpOptions)
  }
}
