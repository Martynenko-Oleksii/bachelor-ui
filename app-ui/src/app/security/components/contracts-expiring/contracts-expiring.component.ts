import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ExpiringContract } from '../../models/contracts';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-contracts-expiring',
  templateUrl: './contracts-expiring.component.html',
  styleUrls: ['./contracts-expiring.component.scss']
})
export class ContractsExpiringComponent extends BaseSubscriber implements OnInit {
  public displayedColumns: string[] = ['contract', 'customer', 'expiring', 'renewal'];
  public dataSource: MatTableDataSource<ExpiringContract> = {} as MatTableDataSource<ExpiringContract>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private api: ApiService) {
    super();
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.api.getExpiringContracts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((contracts: ExpiringContract[]) => {
        if (contracts) {
          this.dataSource!.data = contracts;
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
}
