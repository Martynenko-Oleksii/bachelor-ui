import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Facility, TimePeriodInfo } from '../models/general';
import { Account, CostCenter, ErrorMessage, FileMapping, FileType } from '../models/upload-data';

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

  public getFileTypes(): Observable<FileType[]> {
    return this.http.get<FileType[]>(`${this.baseApi}fileMappings/fileTypes`, this.httpOptions);
  }

  public getMappings(): Observable<FileMapping[]> {
    return this.http.get<FileMapping[]>(`${this.baseApi}fileMappings`, this.httpOptions);
  }

  public createMapping(mapping: FileMapping): Observable<FileMapping> {
    return this.http.post<FileMapping>(`${this.baseApi}fileMappings`, mapping, this.httpOptions);
  }

  public editMapping(mapping: FileMapping): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}fileMappings`, mapping, this.httpOptions);
  }

  public uploadData(formData: FormData): Observable<ErrorMessage[]> {
    return this.http.post<ErrorMessage[]>(`${this.baseApi}dataLoad`, formData, this.httpOptions);
  }

  public getConstCenters(id: number): Observable<CostCenter[]> {
    return this.http.get<CostCenter[]>(`${this.baseApi}costCenters/${id}`, this.httpOptions);
  }

  public createCostCenter(cc: CostCenter): Observable<CostCenter> {
    return this.http.post<CostCenter>(`${this.baseApi}costCenters`, cc, this.httpOptions);
  }

  public editCostCenter(cc: CostCenter): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}costCenters`, cc, this.httpOptions);
  }

  public getAccounts(id: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseApi}accounts/${id}`, this.httpOptions);
  }

  public createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.baseApi}accounts`, account, this.httpOptions);
  }

  public editAccount(account: Account): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}accounts`, account, this.httpOptions);
  }



  public deleteEntity(path: string): Observable<Object> {
    return this.http.delete<Object>(`${this.baseApi}${path}`, this.httpOptions);
  }
}
