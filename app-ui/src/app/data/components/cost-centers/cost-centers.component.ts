import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { CostCenter } from '../../models/upload-data';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CostCenterCreationComponent } from '../cost-center-creation/cost-center-creation.component';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss']
})
export class CostCentersComponent extends BaseSubscriber implements OnInit {
  private facilityId: number = 0;

  public displayedColumns: string[] = ['number', 'description', 'edit'];
  public dataSource: MatTableDataSource<CostCenter> = {} as MatTableDataSource<CostCenter>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private shared: SharedDataService, private api: ApiService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.CostCenters);

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.getFacilityId();
    this.getCostCenters();
  }

  public onCreate(): void {
    let dialogRef = this.dialog.open(CostCenterCreationComponent, {
      data: {
        isCreation: true,
        costCenter: {}
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res && res.added) {
        console.log(res);
        let data = this.dataSource.data;
        data.push(res.costCenter);
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

  public onEdit(costCenter: CostCenter): void {
    let dialogRef = this.dialog.open(CostCenterCreationComponent, {
      data: {
        isCreation: false,
        costCenter: costCenter
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res && res.updated) {
        let cc = this.dataSource.data.find(x => x.number === costCenter.number);
        if (cc) {
          cc.number = res.costCenter.number;
          cc.description = res.costCenter.description;
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

  private getCostCenters(): void {
    this.api.getConstCenters(this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.dataSource.data = res;
        }
      })
  }
}
