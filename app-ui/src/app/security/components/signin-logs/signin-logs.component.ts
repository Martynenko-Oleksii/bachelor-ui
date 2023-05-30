import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { IdentityService } from 'src/app/shared/services/identity.service';
import { Customer, Facility } from '../../models/customer-management';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AuthUser, User } from 'src/app/shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-signin-logs',
  templateUrl: './signin-logs.component.html',
  styleUrls: ['./signin-logs.component.scss']
})
export class SigninLogsComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['name', 'fullName', 'signInDate'];
  public dataSource: MatTableDataSource<User> = {} as MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public customerId: number = 0;

  constructor(private identity: IdentityService, private auth: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.auth.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.customerId = user.customerId;
        this.getUsers(this.customerId);
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  private getUsers(customerId: number): void {
    this.identity.getUsers(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: User[]) => {
        if (users) {
          this.dataSource.data = users;
        }
      })
  }
}
