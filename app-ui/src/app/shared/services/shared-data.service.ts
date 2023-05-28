import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface MenuDict {
  [key: string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private inactiveMenuItems: MenuDict =  {
    'home': true,
    'security': true,
    'data': true,
    'reporting': true,
  };
  private currentMenu: string = 'home';

  private menuDataSource = new ReplaySubject<MenuDict | null>(1);
  menuData$ = this.menuDataSource.asObservable();

  constructor() {
    this.menuDataSource.next(null);
  }

  public updateActiveMenu(name: string): void {
    this.inactiveMenuItems[this.currentMenu] = true;
    this.inactiveMenuItems[name] = false;
    this.currentMenu = name;
    this.menuDataSource.next(this.inactiveMenuItems)
  }
}
