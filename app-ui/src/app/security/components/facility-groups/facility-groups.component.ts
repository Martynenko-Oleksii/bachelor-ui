import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FacilityGroup } from '../../models/access-control';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthUser } from 'src/app/shared/models/user';
import { takeUntil } from 'rxjs';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FacilityGroupCreationComponent } from '../facility-group-creation/facility-group-creation.component';

@Component({
  selector: 'app-facility-groups',
  templateUrl: './facility-groups.component.html',
  styleUrls: ['./facility-groups.component.scss']
})
export class FacilityGroupsComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['name', 'description', 'delete', 'edit'];
  public dataSource: MatTableDataSource<FacilityGroup> = {} as MatTableDataSource<FacilityGroup>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public customerId: number = 0;

  constructor(private api: ApiService, private dialog: MatDialog, private auth: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.customerId = user.customerId;
        this.getFacilityGroups();
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
    let dialogRef = this.dialog.open(FacilityGroupCreationComponent, {
      data: {
        customerId: this.customerId,
        facilityGroup: {
          id: 0,
          name: '',
          description: '',
          facilities: [],
        },
        isAdding: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!!result && result.added) {
        let data = this.dataSource.data;
        data.push(result.facilityGroup);
        this.dataSource.data = data;
      }
    });
  }

  public onDelete(facilityGroup: FacilityGroup): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete Facility Group",
        message: `Would you like to delete facility group '${facilityGroup.name}?'`,
        endpointPath: "facilityGroups/",
        id: facilityGroup.id.toString()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let data = this.dataSource.data;
        const index = data.indexOf(facilityGroup, 0);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSource.data = data;
        }
      }
    });
  }

  public onEdit(facilityGroup: FacilityGroup): void {
    let dialogRef = this.dialog.open(FacilityGroupCreationComponent, {
      data: {
        customerId: this.customerId,
        facilityGroup: facilityGroup,
        isAdding: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.updated && result.customerId === this.customerId) {
        let old = this.dataSource.data.find(x => x.id === facilityGroup.id);
        if (old) {
          old.name = result.facilityGroup.name;
          old.description = result.facilityGroup.description;
          old.facilities = result.facilityGroup.facilities;
        }
      }
    });
  }

  private getFacilityGroups(): void {
    this.api.getFacilityGroups(this.customerId).pipe(takeUntil(this.destroy$))
      .subscribe((facilityGroups: FacilityGroup[]) => {
        if (facilityGroups) {
          this.dataSource.data = facilityGroups;
        }
      });
  }
}
