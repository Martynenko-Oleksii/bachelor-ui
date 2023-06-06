import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CostCenter, StandardDepartment } from '../../models/upload-data';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';
import { CcMappingEditComponent } from '../cc-mapping-edit/cc-mapping-edit.component';

@Component({
  selector: 'app-cost-centers-mapping',
  templateUrl: './cost-centers-mapping.component.html',
  styleUrls: ['./cost-centers-mapping.component.scss']
})
export class CostCentersMappingComponent extends BaseSubscriber implements OnInit {
  private facilityId: number = 0;

  public displayedColumns: string[] = ['number', 'description', 'standardDept', 'dept', 'edit'];
  public dataSource: MatTableDataSource<CostCenter> = {} as MatTableDataSource<CostCenter>;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public standardDepartments: StandardDepartment[] = [];

  constructor(private shared: SharedDataService, private api: ApiService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.CostCentersMapping);
    let dataPeriod = localStorage.getItem('dataPeriod');
    if (dataPeriod) {
      let res = JSON.parse(dataPeriod);
      this.facilityId = res.facility.id;
    }

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;

    this.getStandardDepartments();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  public getDepartmentName(id: number | null): string | undefined {
    return this.standardDepartments.find(x => x.id === id)?.name
  }

  public onEdit(costCenter: CostCenter): void {
    let dialogRef = this.dialog.open(CcMappingEditComponent, {
      data: {
        standardDepartments: this.standardDepartments,
        costCenter: costCenter,
        facilityId: this.facilityId
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res && res.updated) {
        let old = this.dataSource.data.find(x => x.number === costCenter.number);
        if (old) {
          old.department = res.costCenter.department;
        }
      }
    });
  }

  public onConfirm(): void {
    this.api.confirmMapping(this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!!res && !res.completed) {
          this.dataSource.data = res.unmapped;
        }
      })
  }

  private getStandardDepartments(): void {
    this.api.getStandardDepartments(this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.standardDepartments = res;

          this.getCostCenters();
        }
      })
  }

  private getCostCenters(): void {
    this.api.geCostCenterMappings(this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.dataSource.data = res;
        }
      })
  }
}
