import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { StandardDepartment, Facility } from '../../models/customer-management';
import { ApiService } from '../../services/api.service';
import { ContractsCreationComponent } from '../contracts-creation/contracts-creation.component';
import { FacilityGroup } from '../../models/access-control';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-facility-group-creation',
  templateUrl: './facility-group-creation.component.html',
  styleUrls: ['./facility-group-creation.component.scss']
})
export class FacilityGroupCreationComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    name: [this.data.facilityGroup.name, [Validators.required, Validators.maxLength(64)]],
    description: [this.data.facilityGroup.description, [Validators.maxLength(256)]],
    facilities: [this.data.facilityGroup.facilities.map(x => x.id), [Validators.required]],
  });
  
  public facilities: Facility[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: { customerId: number, facilityGroup: FacilityGroup, isAdding: boolean },
    private api: ApiService,
    private dialogRef: MatDialogRef<ContractsCreationComponent>,
    private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.getFacilities();
  }

  public onSybmit(): void {
    let newFacilityGroup: FacilityGroup = {
      id: this.data.facilityGroup.id,
      name: this.form.get('name')!.value!,
      description: this.form.get('description')!.value!,
      customerId: this.data.customerId,
      facilities: this.form.get('facilities')!.value!.map(x => (
        { 
          id: x,
          name: this.facilities.find(y => y.id === x)!.name,
          abbreviation: this.facilities.find(y => y.id === x)!.abbreviation,
          zipCode: this.facilities.find(y => y.id === x)!.zipCode,
          address1: this.facilities.find(y => y.id === x)!.address1,
          address2: this.facilities.find(y => y.id === x)!.address2,
          city: this.facilities.find(y => y.id === x)!.city,
          contactPhone: this.facilities.find(y => y.id === x)!.contactPhone,
          contactEmail: this.facilities.find(y => y.id === x)!.contactEmail,
          facilityStandardDepartments: this.facilities.find(y => y.id === x)!.facilityStandardDepartments,
        }
      )),
    }

    if (this.data.isAdding) {
      this.api.addFacilityGroup(newFacilityGroup).subscribe((facilityGroup: FacilityGroup) => {
        if (facilityGroup) {
          this.dialogRef.close({ added: true, customerId: this.data.customerId, facilityGroup: facilityGroup });
        }
      });
    } else {
      this.api.editFacilityGroup(newFacilityGroup).subscribe(_ => {
        this.dialogRef.close({ updated: true, customerId: this.data.customerId, facilityGroup: newFacilityGroup });
      });
    }
  }

  private getFacilities(): void {
    this.api.getFacilities(this.data.customerId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((facilites: Facility[]) => {
        if (facilites) {
          this.facilities = facilites;
        }
      });
  }
}
