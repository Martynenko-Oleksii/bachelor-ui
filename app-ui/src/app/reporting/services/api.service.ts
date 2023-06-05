import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { CompareGroup, Report, Template } from '../models/management';
import { Observable } from 'rxjs';
import { Facility } from '../models/facility';
import { Department, Measure, TimePeriod } from '../models/parameters';
import { CompareGroupTrendReport, DataSharingContactReport } from '../models/reports';

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

  public getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.baseApi}Component/FacilitiesByUserId`, this.httpOptions);
  }

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseApi}Component/StandartDepartmentsByUserId`, this.httpOptions);
  }

  public createCompareGroup(name: string, facilities: number[]): Observable<Object> {
    return this.http.post(`${this.baseApi}Management/CreateCompareGroup`,
      {
        name: name,
        facilities: facilities
      },
      this.httpOptions);
  }

  public editCompareGroup(id: number, name: string, facilities: number[]): Observable<Object> {
    return this.http.put(`${this.baseApi}Management/EditCompareGroup/${id}`,
    {
      name: name,
      facilities: facilities
    },
    this.httpOptions)
  }

  public createDataSharingContactReport(data: DataSharingContactReport) {
    return this.http.post(
      `${this.baseApi}Administration/CreateDataShareContactReport`,
      data,
      {
        headers: (this.httpOptions as any).headers,
        observe: 'events',
        reportProgress: true,
        responseType: 'blob'
      });
  }

  public createCompareGroupTrendTemplate(data: CompareGroupTrendReport) {
    return this.http.post(`${this.baseApi}GenericReports/CreateCompareGroupTrendReport`, data, this.httpOptions);
  }

  public createCompareGroupTrendReport(data: CompareGroupTrendReport) {
    return this.http.post(
      `${this.baseApi}GenericReports/CreateCompareGroupTrendReport`,
      data,
      {
        headers: (this.httpOptions as any).headers,
        observe: 'events',
        reportProgress: true,
        responseType: 'blob'
      });
  }

  public getTimePeriods(periodType: string): Observable<TimePeriod[]> {
    return this.http.get<TimePeriod[]>(`${this.baseApi}Component/TimePeriodsList/${periodType}`, this.httpOptions);
  }

  public getDepartmentByStandardDepartmentId(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseApi}Component/DepartmentByStandartDep/${id}`, this.httpOptions);
  }

  public getMeasuresByDepartmentId(id: number): Observable<Measure[]> {
    return this.http.get<Measure[]>(`${this.baseApi}Component/MeasuresByDeptId/${id}`, this.httpOptions);
  }
}
