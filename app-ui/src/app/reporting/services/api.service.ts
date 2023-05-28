import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { CompareGroup, Report, Template } from '../models/management';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseApi: string = environment.reportingApi;
  private httpOptions = {};

  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.currentUser$.subscribe(user => {
      if (!!user) {
        this.httpOptions = { headers: new HttpHeaders().append('Authorization', 'Bearer ' + user.token) };
      }
    });
  }

  public getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseApi}Management/TemplateList`, this.httpOptions);
  }

  public getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseApi}Management/ReportList`, this.httpOptions);
  }

  public getCompareGroups(): Observable<CompareGroup[]> {
    return this.http.get<CompareGroup[]>(`${this.baseApi}Management/CompareGroupList`, this.httpOptions);
  }

  public deleteEntity(path: string, id: number): Observable<Object> {
    return this.http.delete(`${this.baseApi}Management/${path}/${id}`, this.httpOptions);
  }
}
