import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Contract, ExpiringContract } from '../models/contracts';
import { Customer, Facility, StandardDepartment } from '../models/customer-management';
import { User } from 'src/app/shared/models/user';
import { DepartmentGroup, FacilityGroup, SecurityUser } from '../models/access-control';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseApi: string = environment.securityApi;
  private httpOptions = {};

  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.currentUser$.subscribe(user => {
      if (!!user) {
        this.httpOptions = { headers: new HttpHeaders().append('Authorization', 'Bearer ' + user.token) };
      }
    });
  }

  public getStandardDepartments(): Observable<StandardDepartment[]> {
    return this.http.get<StandardDepartment[]>(`${this.baseApi}standardDepartments`, this.httpOptions);
  }

  public getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseApi}contracts`, this.httpOptions);
  }

  public getExpiringContracts(): Observable<ExpiringContract[]> {
    return this.http.get<ExpiringContract[]>(`${this.baseApi}customers/expiring`, this.httpOptions);
  }

  public addContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseApi}contracts`, contract, this.httpOptions);
  }

  public editContract(contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.baseApi}contracts`, contract, this.httpOptions);
  }

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseApi}customers`, this.httpOptions);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseApi}customers`, customer, this.httpOptions);
  }

  public editCUstomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseApi}customers`, customer, this.httpOptions);
  }

  public getFacilities(customerId: number): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.baseApi}customers/facilities`, this.httpOptions);
  }

  public addFacility(customerId: number, facility: Facility): Observable<Facility> {
    return this.http.post<Facility>(`${this.baseApi}customers/facilities`, facility, this.httpOptions);
  }

  public aditFacility(facility: Facility): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}customers/facilities`, facility, this.httpOptions);
  }

  public deleteEntity(endpointPath: string, id: string): Observable<Object> {
    return this.http.delete(`${this.baseApi}${endpointPath}${id}`, this.httpOptions);
  }

  public getUsers(customerId: number): Observable<SecurityUser[]> {
    return this.http.get<SecurityUser[]>(`${this.baseApi}users`, this.httpOptions);
  }

  public getFacilityGroups(customerId: number): Observable<FacilityGroup[]> {
    return this.http.get<FacilityGroup[]>(`${this.baseApi}facilityGroups`, this.httpOptions);
  }

  public addFacilityGroup(facilityGroup: FacilityGroup): Observable<FacilityGroup> {
    return this.http.post<FacilityGroup>(`${this.baseApi}facilityGroups`, facilityGroup, this.httpOptions);
  }

  public editFacilityGroup(facilityGroup: FacilityGroup): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}facilityGroups`, facilityGroup, this.httpOptions);
  }

  public getDepartmentGroups(customerId: number): Observable<DepartmentGroup[]> {
    return this.http.get<DepartmentGroup[]>(`${this.baseApi}departmentGroups`, this.httpOptions);
  }

  public addDepartmentGroup(departmentGroup: DepartmentGroup): Observable<DepartmentGroup> {
    return this.http.post<DepartmentGroup>(`${this.baseApi}departmentGroups`, departmentGroup, this.httpOptions);
  }

  public editDepartmentGroup(departmentGroup: DepartmentGroup): Observable<Object> {
    return this.http.put<Object>(`${this.baseApi}departmentGroups`, departmentGroup, this.httpOptions);
  }

  public addUser(user: SecurityUser): Observable<Object> {
    return this.http.post<Object>(`${this.baseApi}users`, user, this.httpOptions);
  }
}
