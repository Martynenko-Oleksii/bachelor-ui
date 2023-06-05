import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Facility, TimePeriodInfo } from '../models/general';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseApi: string = environment.dataApi;
  private httpOptions = {};

  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.currentUser$.subscribe(user => {
      if (!!user) {
        this.httpOptions = { headers: new HttpHeaders().append('Authorization', 'Bearer ' + user.token) };
      }
    });
  }

  public getfacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.baseApi}configuration/facilities`, this.httpOptions);
  }

  public getTimePeriods(id: number): Observable<TimePeriodInfo[]> {
    return this.http.get<TimePeriodInfo[]>(`${this.baseApi}configuration/currentTimePeriod/${id}`, this.httpOptions);
  }
}
