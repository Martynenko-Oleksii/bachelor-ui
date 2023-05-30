import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DepartmentGroup, FacilityGroup } from '../../models/access-control';
import { Facility, StandardDepartment } from '../../models/customer-management';
import { ApiService } from '../../services/api.service';
import { ContractsCreationComponent } from '../contracts-creation/contracts-creation.component';

@Component({
  selector: 'app-department-group-creation',
  templateUrl: './department-group-creation.component.html',
  styleUrls: ['./department-group-creation.component.scss']
})
export class DepartmentGroupCreationComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    name: [this.data.departmentGroup.name, [Validators.required, Validators.maxLength(64)]],
    description: [this.data.departmentGroup.description, [Validators.maxLength(256)]],
    standardDepartments: [this.data.departmentGroup.standardDepartments.map(x => x.id), [Validators.required]],
  });
  
  public departments: StandardDepartment[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: { customerId: number, departmentGroup: DepartmentGroup, isAdding: boolean },
    private api: ApiService,
    private dialogRef: MatDialogRef<ContractsCreationComponent>,
    private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.getDepartments();
  }

  public onSybmit(): void {
    let newDepartmentGroup: DepartmentGroup = {
      id: this.data.departmentGroup.id,
      name: this.form.get('name')!.value!,
      description: this.form.get('description')!.value!,
      customerId: this.data.customerId,
      standardDepartments: this.form.get('standardDepartments')!.value!.map(x => (
        { 
          id: x,
          name: this.departments.find(y => y.id === x)!.name,
          description: this.departments.find(y => y.id === x)!.name,
        }
      )),
    }

    if (this.data.isAdding) {
      this.api.addDepartmentGroup(newDepartmentGroup).subscribe((departmentGroup: DepartmentGroup) => {
        if (departmentGroup) {
          this.dialogRef.close({ added: true, customerId: this.data.customerId, departmentGroup: departmentGroup });
        }
      });
    } else {
      this.api.editDepartmentGroup(newDepartmentGroup).subscribe(_ => {
        this.dialogRef.close({ updated: true, customerId: this.data.customerId, departmentGroup: newDepartmentGroup });
      });
    }
  }

  private getDepartments(): void {
    this.api.getStandardDepartments()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((departments: StandardDepartment[]) => {
        if (departments) {
          this.departments = departments;
        }
      });
  }
}
