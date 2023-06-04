import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { AuthUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Customer, Facility, StandardDepartment } from '../../models/customer-management';
import { ApiService } from '../../services/api.service';
import { CustomersCreationComponent } from '../customers-creation/customers-creation.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { FacilityCreationComponent } from '../facility-creation/facility-creation.component';
import { MatSelectChange } from '@angular/material/select';
import { SecurityMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['name', 'abbr', 'zip', 'city', 'phone', 'email', 'delete', 'edit'];
  public dataSource: MatTableDataSource<Facility> = {} as MatTableDataSource<Facility>;

  public customers: Customer[] = [];
  public customerId: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog, private auth: AuthService, private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateSecurityActiveMenu(SecurityMenuItem.Facilities);

    this.auth.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.customerId = user.customerId;
      }
    });

    this.getCustomers();

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.getFacilities(this.customerId);
  }

  public onCustomerChange(): void {
    this.getFacilities(this.customerId);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  public onAdd(): void {
    let dialogRef = this.dialog.open(FacilityCreationComponent, {
      data: {
        customerId: this.customerId,
        facility: {
          id: 0,
          name: '',
          abbreviation: '',
          zipCode: '',
          address1: '',
          address2: '',
          city: '',
          contactPhone: '',
          contactEmail: '',
          facilityStandardDepartments: [],
        },
        isAdding: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!!result && result.added && result.customerId === this.customerId) {
        let data = this.dataSource.data;
        data.push(result.facility);
        this.dataSource.data = data;
      }
    });
  }

  public onDelete(facility: Facility): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete Facility",
        message: `Would you like to delete facility '${facility.name}?'`,
        endpointPath: "customers/facilities/",
        id: facility.id.toString()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let data = this.dataSource.data;
        const index = data.indexOf(facility, 0);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSource.data = data;
        }
      }
    });
  }

  public onEdit(facility: Facility): void {
    let dialogRef = this.dialog.open(FacilityCreationComponent, {
      data: {
        customerId: this.customerId,
        facility: facility,
        isAdding: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.updated && result.customerId === this.customerId) {
        let old = this.dataSource.data.find(x => x.id === facility.id);
        if (old) {
          old.name = result.facility.name;
          old.abbreviation = result.facility.abbreviation;
          old.zipCode = result.facility.zipCode;
          old.address1 = result.facility.address1;
          old.address2 = result.facility.address2;
          old.city = result.facility.city;
          old.contactPhone = result.facility.contactPhone;
          old.contactEmail = result.facility.contactEmail;
          old.facilityStandardDepartments = result.facility.facilityStandardDepartments;
        }
      }
    });
  }

  private getCustomers(): void {
    this.api.getCustomers()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((customers: Customer[]) => {
        if (customers) {
          this.customers = customers;
        }
      });
  }

  private getFacilities(customerId: number): void {
    this.api.getFacilities(customerId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((facilites: Facility[]) => {
        if (facilites) {
          this.dataSource!.data = facilites;
        }
      });
  }
}
