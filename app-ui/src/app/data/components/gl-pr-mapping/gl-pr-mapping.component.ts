import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Account, CostCenter, MappingTableRow, ValueType, DepartmentElement } from '../../models/upload-data';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-gl-pr-mapping',
  templateUrl: './gl-pr-mapping.component.html',
  styleUrls: ['./gl-pr-mapping.component.scss']
})
export class GlPrMappingComponent extends BaseSubscriber implements OnInit {
  private facilityId: number = 0;

  public filtersForm = this.fb.group({
    mapped: [null],
    valueType: [{value: undefined, disabled: true}],
    account: [{value: undefined, disabled: true}],
    costCenter: [{value: undefined, disabled: true}]
  });

  public displayedColumns: string[] = ['costCenter', 'account', 'accountType', 'dept', 'deptElement'];
  public dataSource: MatTableDataSource<MappingTableRow> = {} as MatTableDataSource<MappingTableRow>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  public valueTypes: ValueType[] = [];
  public accounts: Account[] = [];
  public costCenters: CostCenter[] = [];
  public departmentElementsPerStdDept: { [key: number]: DepartmentElement[] } = {};

  public departmentElements: DepartmentElement[] = [];

  public dataFiltered: boolean = false;

  constructor(private shared: SharedDataService, private api: ApiService, private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.GlPrMapping);
    let dataPeriod = localStorage.getItem('dataPeriod');
    if (dataPeriod) {
      let res = JSON.parse(dataPeriod);
      this.facilityId = res.facility.id;
    }

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator!;
  }

  public onSelectMapped(): void {
    this.filtersForm.get('valueType')?.setValue(null);
    this.filtersForm.get('valueType')?.enable();

    this.filtersForm.get('account')?.setValue(null);
    this.filtersForm.get('account')?.disable();
    this.filtersForm.get('costCenter')?.setValue(null);
    this.filtersForm.get('costCenter')?.disable();

    if (this.dataFiltered) {
      this.dataSource.data = [];
      this.dataFiltered = false;
    }

    this.getValueTypes();
  }

  public onSelectAccountType(): void {
    this.filtersForm.get('account')?.setValue(null);
    this.filtersForm.get('account')?.disable();
    this.filtersForm.get('costCenter')?.setValue(null);
    this.filtersForm.get('costCenter')?.disable();
    this.dataFiltered = false;

    this.getAccounts();
  }

  public onSelectAccount(): void {
    this.filtersForm.get('costCenter')?.setValue(null);
    this.filtersForm.get('costCenter')?.disable();
    this.dataFiltered = false;

    this.getCostCenters();
  }

  public onSelectCostCenter(): void {
    this.getMappingRows();
  }

  public onChangeMapping(mappingId: number, deptElementId: number): void {
    this.api.updateMapping(mappingId, deptElementId)
      .subscribe(_ => {
        console.log('ok!');
      });
  }

  private getValueTypes(): void {
    let mapped = this.filtersForm.get('mapped')!.value!
    this.api.getValueTypes(mapped, this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.valueTypes = res;
        }
      });
  }

  private getAccounts(): void {
    let mapped = this.filtersForm.get('mapped')!.value!
    let valueTypeId = this.filtersForm.get('valueType')!.value!
    this.api.getFilterAccounts(mapped, valueTypeId, this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.accounts = res;
          this.filtersForm.get('account')?.enable();
        }
      });
  }

  private getCostCenters(): void {
    let mapped = this.filtersForm.get('mapped')!.value!
    let valueTypeId = this.filtersForm.get('valueType')!.value!
    let accountCode = this.filtersForm.get('account')!.value!

    this.api.getFilterCostCenters(mapped, valueTypeId, accountCode, this.facilityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.costCenters = res;
          this.filtersForm.get('costCenter')?.enable();
        }
      });
  }

  private getMappingRows(): void {
    let mapped = this.filtersForm.get('mapped')!.value!
    let valueTypeId = this.filtersForm.get('valueType')!.value!
    let accountCode = this.filtersForm.get('account')!.value!
    let ccNumber = this.filtersForm.get('costCenter')!.value!

    //this.getDepartmentElements(this.costCenters.find(x => x.number === ccNumber)!.department!.standardDepartmentId!);

    //console.log(this.costCenters.find(x => x.number === ccNumber)!.department!.standardDepartmentId!);

    this.api.getMappingRows(mapped, valueTypeId, accountCode, ccNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let selectedStdDepts: number[] = [];
          res.forEach(x => {
            if (!selectedStdDepts.includes(x.costCenter.department!.standardDepartmentId)) {
              this.getDepartmentElements(x.costCenter.department!.standardDepartmentId);
              selectedStdDepts.push(x.costCenter.department!.standardDepartmentId);
            }
          });

          this.dataSource.data = res;
          this.dataFiltered = true;
        }
      });
  }

  private getDepartmentElements(stdDeptId: number): void {
    this.departmentElements = [];
    this.api.getDeprElements(stdDeptId)
      .pipe(takeUntil(this.departmentElements))
      .subscribe(res => {
        if (res) {
          this.departmentElementsPerStdDept[stdDeptId] = res;
          //this.departmentElements = res;
        }
      });
  }
}

