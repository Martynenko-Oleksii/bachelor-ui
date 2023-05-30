import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { Contract } from '../../models/contracts';
import { Customer, Facility, StandardDepartment } from '../../models/customer-management';
import { ApiService } from '../../services/api.service';
import { ContractsCreationComponent } from '../contracts-creation/contracts-creation.component';

@Component({
  selector: 'app-facility-creation',
  templateUrl: './facility-creation.component.html',
  styleUrls: ['./facility-creation.component.scss']
})
export class FacilityCreationComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    name: [this.data.facility.name, [Validators.required, Validators.maxLength(64)]],
    abbreviation: [this.data.facility.abbreviation, [Validators.required, Validators.maxLength(16)]],
    zipCode: [this.data.facility.zipCode, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    address1: [this.data.facility.address1, [Validators.required, Validators.maxLength(128)]],
    address2: [this.data.facility.address2, [Validators.maxLength(128)]],
    city: [this.data.facility.city, [Validators.required, Validators.maxLength(16)]],
    contactPhone: [this.data.facility.contactPhone, [Validators.required, Validators.maxLength(15)]],
    contactEmail: [this.data.facility.contactEmail, [Validators.required, Validators.maxLength(64), Validators.email]],
    facilityStandardDepartments: [this.data.facility.facilityStandardDepartments, [Validators.required]],
  });
  
  public departments: StandardDepartment[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: { customerId: number, facility: Facility, isAdding: boolean },
    private api: ApiService,
    private dialogRef: MatDialogRef<ContractsCreationComponent>,
    private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.getStandardDepartments();
  }

  public getStandardDepartments(): void {
    this.api.getStandardDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((departments: StandardDepartment[]) => this.departments = departments);
  }

  public onSybmit(): void {
    let newFacility: Facility = {
      id: this.data.facility.id,
      name: this.form.get('name')!.value!,
      abbreviation: this.form.get('abbreviation')!.value!,
      zipCode: this.form.get('zipCode')!.value!,
      address1: this.form.get('address1')!.value!,
      address2: this.form.get('address2')!.value!,
      city: this.form.get('city')!.value!,
      contactPhone: this.form.get('contactPhone')!.value!,
      contactEmail: this.form.get('contactEmail')!.value!,
      facilityStandardDepartments: this.form.get('facilityStandardDepartments')!.value!,
    }

    if (this.data.isAdding) {
      this.api.addFacility(this.data.customerId, newFacility).subscribe((facility: Facility) => {
        if (facility) {
          this.dialogRef.close({ added: true, customerId: this.data.customerId, facility: facility });
        }
      });
    } else {
      this.api.aditFacility(newFacility).subscribe(_ => {
        this.dialogRef.close({ updated: true, customerId: this.data.customerId, facility: newFacility });
      });
    }
  }
}
