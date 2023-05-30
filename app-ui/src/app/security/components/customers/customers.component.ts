import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../models/customer-management';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { CustomersCreationComponent } from '../customers-creation/customers-creation.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'contract', 'status', 'delete', 'edit'];
  public dataSource: MatTableDataSource<Customer> = {} as MatTableDataSource<Customer>;
  public customerId: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog, private auth: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.customerId = user.customerId;
      }
    });

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.getCustomers();
  }

  public get currentDate(): Date {
    return new Date();
  }

  private getCustomers(): void {
    this.api.getCustomers()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((customer: Customer[]) => {
        if (customer) {
          this.dataSource!.data = customer;
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

  public onAdd(): void {
    let dialogRef = this.dialog.open(CustomersCreationComponent, {
      data: {
        customer: {
          id: 0,
          name: '',
          autoRenewal: true,
          contract: {
            id: 0,
            name: '',
            description: '',
            duration: 0,
            start: 0
          },
        },
        isAdding: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.added) {
        let data = this.dataSource.data;
        data.push(result.customer);
        this.dataSource.data = data;
      }
    });
  }

  public onDelete(customer: Customer): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete Customer",
        message: `Would you like to delete customer '${customer.name}?'`,
        endpointPath: "customers/",
        id: customer.id.toString()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let data = this.dataSource.data;
        const index = data.indexOf(customer, 0);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSource.data = data;
        }
      }
    });
  }

  public onEdit(customer: Customer): void {
    let dialogRef = this.dialog.open(CustomersCreationComponent, {
      data: {
        customer: customer,
        isAdding: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result.updated) {
        let old = this.dataSource.data.find(x => x.id === customer.id);
        if (old) {
          old.name = result.customer.name;
          old.description = result.customer.description;
          old.contract = result.customer.contract;
          old.autoRenewal = result.customer.autoRenewal;
        }
      }
    });
  }
}
