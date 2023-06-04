import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface MenuDict {
  [key: string]: boolean
}

export enum GlobalMenuItem {
  Home = 'home',
  Security = 'security',
  Data = 'data',
  Reporting = 'reporting'
}

export enum SecurityMenuItem {
  Users = 'users',
  FacilityGroups = 'facility-groups',
  DepartmentGroups = 'department-groups',
  Customers = 'customers',
  Facilities = 'facilities',
  Contracts = 'contracts',
  ExpiringContracts = 'expiring-contracts',
  ResetPasswords = 'reset-passwords',
  Logs = 'logs',
}

export enum ReportingMenuItem {
  Templates = 'templates',
  Reports = 'reports',
  CompareGroups = 'compare-groups',
  DataSharingReport = 'data-sharing-report',
  CompareGroupTrend = 'cg-trend',
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private currentMenu: string = 'home';
  private inactiveMenuItems: MenuDict = {
    'home': true,
    'security': true,
    'data': true,
    'reporting': true,
  };

  private menuDataSource = new ReplaySubject<MenuDict | null>(1);
  menuData$ = this.menuDataSource.asObservable();

  private currentSecurityMenu = '';
  private inactiveSecurityItems: MenuDict = {
    'users': true,
    'facility-groups': true,
    'department-groups': true,
    'customers': true,
    'facilities': true,
    'contracts': true,
    'expiring-contracts': true,
    'reset-passwords': true,
    'logs': true
  };
  
  private securityMenuDataSource = new ReplaySubject<MenuDict | null>(1);
  securityMenuData$ = this.securityMenuDataSource.asObservable();

  private currentReportingMenu = '';
  private inactiveReportingItems: MenuDict = {
    'templates': true,
    'reports': true,
    'compare-groups': true,
    'data-sharing-report': true,
    'cg-trend': true,
  };
  
  private reportingMenuDataSource = new ReplaySubject<MenuDict | null>(1);
  reportingMenuData$ = this.reportingMenuDataSource.asObservable();

  constructor() {
    this.menuDataSource.next(null);
    this.securityMenuDataSource.next(null);
    this.reportingMenuDataSource.next(null);
  }

  public updateActiveMenu(name: string): void {
    this.inactiveMenuItems[this.currentMenu] = true;
    this.inactiveMenuItems[name] = false;
    this.currentMenu = name;
    this.menuDataSource.next(this.inactiveMenuItems);
  }

  public updateSecurityActiveMenu(name: string): void {
    if (this.currentSecurityMenu.length > 0) {
      this.inactiveSecurityItems[this.currentSecurityMenu] = true;
    }
    
    this.inactiveSecurityItems[name] = false;
    this.currentSecurityMenu = name;

    this.securityMenuDataSource.next(this.inactiveSecurityItems);
  }

  public updateReportingActiveMenu(name: string): void {
    if (this.currentReportingMenu.length > 0) {
      this.inactiveReportingItems[this.currentReportingMenu] = true;
    }
    
    this.inactiveReportingItems[name] = false;
    this.currentReportingMenu = name;

    this.reportingMenuDataSource.next(this.inactiveReportingItems);
  }
}
