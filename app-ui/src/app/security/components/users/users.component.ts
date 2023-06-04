import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DepartmentGroup, FacilityGroup, SecurityUser } from '../../models/access-control';
import { AuthUser, User } from 'src/app/shared/models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { IdentityService } from 'src/app/shared/services/identity.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { UserCreationComponent } from '../user-creation/user-creation.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { SecurityMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseSubscriber implements OnInit {
  private securityUsers: SecurityUser[] = [];
  private users: User[] = [];

  public displayedColumns: string[] = ['name', 'fullName', 'email', 'delete', 'edit'];
  public dataSource: MatTableDataSource<User> = {} as MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public facilityGroupId: number = 0;
  public facilityGroups: FacilityGroup[] = [];
  public departmentGroupId: number = 0;
  public departmentGroups: DepartmentGroup[] = [];

  public userId: string = '';
  public customerId: number = 0;
  public customerName: string = '';

  constructor(private api: ApiService,
    private identity: IdentityService,
    private auth: AuthService,
    private dialog: MatDialog,
    private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateSecurityActiveMenu(SecurityMenuItem.Users);

    this.auth.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.userId = user.id;
        this.customerId = user.customerId;
        this.customerName = user.customer;
        
        this.getUsers();
        this.getFacilityGroups();
        this.getDepartmentGroup();
      }
    })

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  public onApplyFilters(): void {
    let filteredUsers = this.securityUsers.filter(x => {
      let res = true;

      if (this.facilityGroupId !== 0) {
        res = res && x.facilityGroup.id === this.facilityGroupId;
      }

      if (this.departmentGroupId !== 0) {
        res = res && x.departmentGroup.id === this.departmentGroupId;
      }

      return res;
    });

    let arr: User[] = [];
    filteredUsers.forEach(x => {
      arr.push(this.users.find(y => y.id === x.userId)!);
    });

    this.dataSource.data = arr;
  }

  public onAdd(): void {
    let dialogRef = this.dialog.open(UserCreationComponent, {
      data: {
        facilityGroups: this.facilityGroups,
        departmentGroups: this.departmentGroups,
        securityUser: {
          userId: '',
          customerId: this.customerId,
          facilityGroup: null,
          departmentGroup: null,
        },
        user: {    
          id: '',
          userName: '',
          fullName: '',
          signInTime: new Date(),
          email: ''
        },
        isAdding: true,
        customerId: this.customerId,
        customerName: this.customerName,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.added) {
        let data = this.dataSource.data;
        data.push(result.user);
        this.dataSource.data = data;
      }
    });
  }

  public onEdit(user: User): void {
    let dialogRef = this.dialog.open(UserCreationComponent, {
      data: {
        facilityGroups: this.facilityGroups,
        departmentGroups: this.departmentGroups,
        securityUser: this.securityUsers.find(x => x.userId === user.id),
        user: this.users.find(x => x.id === user.id),
        isAdding: false,
        customerId: this.customerId,
        customerName: this.customerName,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.updated) {
        let old = this.dataSource.data.find(x => x.id === user.id);
        if (old) {
          old.userName = result.user.name;
          old.fullName = result.user.fullName;
          old.email = result.user.facilities;
        }
      }
    });
  }

  public onDelete(user: User): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete User",
        message: `Would you like to delete user '${user.userName}?'`,
        endpointPath: "users/",
        id: user.id
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {

        this.identity.deleteUser(user.id)
          .subscribe(_ => {
            let data = this.dataSource.data;
            const index = data.indexOf(user, 0);
            if (index > -1) {
              data.splice(index, 1);
              this.dataSource.data = data;
            }
          });
      }
    });
  }

  private getUsers(): void {
    this.api.getUsers(this.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((securityUsers: SecurityUser[]) => {
        if (securityUsers) {
          this.securityUsers = securityUsers;

          this.identity.getUsers(this.customerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((users: User[]) => {
              this.users = users;
              this.dataSource.data = users;
            });
        }
      });
  }

  private getFacilityGroups(): void {
    this.api.getFacilityGroups(this.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((facilityGroups: FacilityGroup[]) => {
        if (facilityGroups) {
          this.facilityGroups = facilityGroups;
        }
      });
  }

  private getDepartmentGroup(): void {
    this.api.getDepartmentGroups(this.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((departmentGroups: DepartmentGroup[]) => {
        if (departmentGroups) {
          this.departmentGroups = departmentGroups;
        }
      });
  }
}
