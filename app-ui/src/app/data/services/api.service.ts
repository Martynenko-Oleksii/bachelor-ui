import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Facility, TimePeriodInfo } from '../models/general';
import { Account, CostCenter, Department, DepartmentElement, ErrorMessage, FileMapping, FileType, MappingTableRow, StandardDepartment, ValueType } from '../models/upload-data';

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



  public getStandardDepartments(id: number): Observable<StandardDepartment[]> {
    return this.http.get<StandardDepartment[]>(`${this.baseApi}CCMapping/standardDepartment/${id}`, this.httpOptions);
  }

  public geCostCenterMappings(id: number): Observable<CostCenter[]> {
    return this.http.get<CostCenter[]>(`${this.baseApi}CCMapping/costCenter/${id}`, this.httpOptions);
  }

  public getDepartments(facilityId: number, stdDeptId: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseApi}CCMapping/department`, {
      headers: (this.httpOptions as any).headers,
      params: {
        facilityId: facilityId,
        standardDepartmentId: stdDeptId
      }
    });
  }

  public updateCostCEnterMapping(cc: CostCenter): Observable<Object> {
    return this.http.put(`${this.baseApi}CCMapping/costCenter`, cc, this.httpOptions);
  }

  public creaateNewDept(dept: Department): Observable<Department> {
    return this.http.post<Department>(`${this.baseApi}CCMapping/department`, dept, this.httpOptions);
  }

  public deleteDept(id: number): Observable<Object> {
    return this.http.delete(`${this.baseApi}CCMapping/department/${id}`, this.httpOptions);
  }

  public confirmMapping(id: number): Observable<{completed: boolean, unmapped: CostCenter[]}> {
    return this.http.get<{completed: boolean, unmapped: CostCenter[]}>(`${this.baseApi}CCMapping/confirm/${id}`, this.httpOptions);
  }



  public getValueTypes(): Observable<ValueType[]> {
    return this.http.get<ValueType[]>(`${this.baseApi}glPrMapping/accountTypes`, this.httpOptions);
  }

  public getFilterAccounts(mapped: boolean, valueTypeid: number, facilityId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseApi}glPrMapping/accounts`, {
      params: {
        valueTypeId: valueTypeid,
        mapped: mapped,
        facilityId: facilityId
      },
      headers: (this.httpOptions as any).headers
    });
  }

  public getFilterCostCenters(mapped: boolean, valueTypeid: number, code: string, facilityId: number): Observable<CostCenter[]> {
    return this.http.get<CostCenter[]>(`${this.baseApi}glPrMapping/costCenters`, {
      params: {
        valueTypeId: valueTypeid,
        mapped: mapped,
        code: code,
        facilityId: facilityId
      },
      headers: (this.httpOptions as any).headers
    });
  }

  public getMappingRows(mapped: boolean, valueTypeid: number, code: string, number: string): Observable<MappingTableRow[]> {
    return this.http.get<MappingTableRow[]>(`${this.baseApi}glPrMapping/mappings`, {
      params: {
        valueTypeId: valueTypeid,
        mapped: mapped,
        code: code,
        costCenter: number
      },
      headers: (this.httpOptions as any).headers
    });
  }

  public getDeprElements(stdDeptId: number): Observable<DepartmentElement[]> {
    return this.http.get<DepartmentElement[]>(`${this.baseApi}glPrMapping/departmentElements/${stdDeptId}`, this.httpOptions);
  }

  public updateMapping(mappingId: number, deptElementId: number): Observable<Object> {
    return this.http.put(`${this.baseApi}glPrMapping`, null, {
      params: {
        mappingId: mappingId,
        departmentElementId: deptElementId
      },
      headers: (this.httpOptions as any).headers
    })
  }



  public deleteEntity(path: string): Observable<Object> {
    return this.http.delete<Object>(`${this.baseApi}${path}`, this.httpOptions);
  }
}
