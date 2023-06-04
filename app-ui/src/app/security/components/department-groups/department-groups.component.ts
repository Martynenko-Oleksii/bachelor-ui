import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { AuthUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DepartmentGroup, FacilityGroup } from '../../models/access-control';
import { ApiService } from '../../services/api.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FacilityGroupCreationComponent } from '../facility-group-creation/facility-group-creation.component';
import { DepartmentGroupCreationComponent } from '../department-group-creation/department-group-creation.component';
import { SecurityMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-department-groups',
  templateUrl: './department-groups.component.html',
  styleUrls: ['./department-groups.component.scss']
})
export class DepartmentGroupsComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['name', 'description', 'delete', 'edit'];
  public dataSource: MatTableDataSource<DepartmentGroup> = {} as MatTableDataSource<DepartmentGroup>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public customerId: number = 0;

  constructor(private api: ApiService, private dialog: MatDialog, private auth: AuthService, private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateSecurityActiveMenu(SecurityMenuItem.DepartmentGroups);

    this.auth.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.customerId = user.customerId;
        this.getDepartmentGroups();
      }
    });


    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  public onAdd(): void {
    let dialogRef = this.dialog.open(DepartmentGroupCreationComponent, {
      data: {
        customerId: this.customerId,
        departmentGroup: {
          id: 0,
          name: '',
          description: '',
          standardDepartments: [],
        },
        isAdding: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!!result && result.added) {
        let data = this.dataSource.data;
        data.push(result.departmentGroup);
        this.dataSource.data = data;
      }
    });
  }

  public onDelete(departmentGroup: DepartmentGroup): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete Department Group",
        message: `Would you like to delete department group '${departmentGroup.name}?'`,
        endpointPath: "departmentGroups/",
        id: departmentGroup.id.toString()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let data = this.dataSource.data;
        const index = data.indexOf(departmentGroup, 0);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSource.data = data;
        }
      }
    });
  }

  public onEdit(departmentGroup: DepartmentGroup): void {
    let dialogRef = this.dialog.open(DepartmentGroupCreationComponent, {
      data: {
        customerId: this.customerId,
        departmentGroup: departmentGroup,
        isAdding: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.updated && result.customerId === this.customerId) {
        let old = this.dataSource.data.find(x => x.id === departmentGroup.id);
        if (old) {
          old.name = result.departmentGroup.name;
          old.description = result.departmentGroup.description;
          old.standardDepartments = result.departmentGroup.facilities;
        }
      }
    });
  }

  private getDepartmentGroups(): void {
    this.api.getDepartmentGroups(this.customerId).pipe(takeUntil(this.destroy$))
      .subscribe((DepartmentGroups: DepartmentGroup[]) => {
        if (DepartmentGroups) {
          this.dataSource.data = DepartmentGroups;
        }
      });
  }
}
