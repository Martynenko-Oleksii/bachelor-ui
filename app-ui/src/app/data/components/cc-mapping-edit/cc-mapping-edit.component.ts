import { Component, OnInit, Inject } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StandardDepartment } from 'src/app/security/models/customer-management';
import { CostCenter, Department } from '../../models/upload-data';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-cc-mapping-edit',
  templateUrl: './cc-mapping-edit.component.html',
  styleUrls: ['./cc-mapping-edit.component.scss']
})
export class CcMappingEditComponent extends BaseSubscriber implements OnInit {
  public departments: Department[] = [];

  public form = this.fb.group({
    stdDept: [this.data.costCenter.department?.standardDepartmentId, [Validators.required]],
    dept: [this.data.costCenter.department?.id, [Validators.required]]
  });

  public deptAdding: boolean = false;
  public deptForm = this.fb.group({
    name: ['', [Validators.required]],
    shortName: ['', [Validators.required]]
  });

  constructor(private api: ApiService, private fb: FormBuilder, private dialogRef: MatDialogRef<CcMappingEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { standardDepartments: StandardDepartment[], costCenter: CostCenter, facilityId: number }) {
    super();
  }

  public ngOnInit(): void {
    if (this.data.costCenter.department) {
      this.onSelectStdDept(this.data.costCenter.department.standardDepartmentId);
    }
  }

  public onSelectStdDept(id: number): void {
    this.api.getDepartments(this.data.facilityId, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.departments = res;
        }
      })
  }

  public onCreateDept(): void {
    let dept: Department = {
      id: 0,
      facilityId: this.data.facilityId,
      standardDepartmentId: this.form.get('stdDept')!.value!,
      name: this.deptForm.get('name')!.value!,
      shortName: this.deptForm.get('shortName')!.value!
    };

    this.api.creaateNewDept(dept)
      .subscribe(res => {
        if (res) {
          if (res.standardDepartmentId === this.form.get('stdDept')!.value!) {
            this.departments.push(res);
            this.form.get('dept')?.setValue(res.id);
            this.deptAdding = !this.deptAdding;
          }
        }
      });
  }

  public onSave(): void {
    let dept = this.departments.find(x => x.id === this.form.get('dept')!.value!);
    this.data.costCenter.department = dept ?? null;
    this.api.updateCostCEnterMapping(this.data.costCenter)
      .subscribe(_ => {
        this.dialogRef.close({updated: true, costCenter: this.data.costCenter});
      });
  }
}
