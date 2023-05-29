import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Contract } from '../models/contracts';
import { Customer } from '../models/customer-management';

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

  public getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseApi}contracts`, this.httpOptions);
  }

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseApi}customers`, this.httpOptions);
  }

  public addContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseApi}contracts`, contract, this.httpOptions);
  }

  public editContract(contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.baseApi}contracts`, contract, this.httpOptions);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseApi}customers`, customer, this.httpOptions);
  }

  public editCUstomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseApi}customers`, customer, this.httpOptions);
  }

  public deleteEntity(endpointPath: string, id: string): Observable<Object> {
    return this.http.delete(`${this.baseApi}${endpointPath}${id}`, this.httpOptions);
  }
}
