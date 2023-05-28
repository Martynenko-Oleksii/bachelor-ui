import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Report, Template } from '../models/management';
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
}
