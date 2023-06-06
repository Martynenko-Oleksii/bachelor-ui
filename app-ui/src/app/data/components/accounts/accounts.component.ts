import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../models/upload-data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService, DataMenuItem } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { AccountCreationComponent } from '../account-creation/account-creation.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent extends BaseSubscriber implements OnInit {
  private facilityId: number = 0;

  public displayedColumns: string[] = ['code', 'description', 'source', 'type', 'edit'];
  public dataSource: MatTableDataSource<Account> = {} as MatTableDataSource<Account>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private shared: SharedDataService, private api: ApiService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.Accounts);

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.getFacilityId();
    this.getAccounts();
  }

  public onCreate(): void {
    let dialogRef = this.dialog.open(AccountCreationComponent, {
      data: {
        isCreation: true,
        account: {}
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res && res.added) {
        console.log(res);
        let data = this.dataSource.data;
        data.push(res.account);
        this.dataSource.data = data;
      }
    })
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  public onEdit(account: Account): void {
    let dialogRef = this.dialog.open(AccountCreationComponent, {
      data: {
        isCreation: false,
        account: account
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res && res.updated) {
        let cc = this.dataSource.data.find(x => x.code === account.code);
        if (cc) {
          cc.description = res.account.description;
        }
      }
    });
  }

  private getFacilityId(): void {
    let dataPeriod = localStorage.getItem('dataPeriod');
    if (dataPeriod) {
      let res = JSON.parse(dataPeriod);
      this.facilityId = res.facility.id;
    }
  }

  private getAccounts(): void {
    this.api.getAccounts(this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.dataSource.data = res;
        }
      })
  }
}
