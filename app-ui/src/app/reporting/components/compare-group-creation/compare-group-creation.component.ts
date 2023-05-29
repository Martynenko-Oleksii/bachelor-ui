import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { Facility } from '../../models/facility';
import { takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompareGroup } from '../../models/management';

@Component({
  selector: 'app-compare-group-creation',
  templateUrl: './compare-group-creation.component.html',
  styleUrls: ['./compare-group-creation.component.scss']
})
export class CompareGroupCreationComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    name: [this.data.name, [ Validators.required, Validators.maxLength(64) ]],
    facilities: [this.data.facilities, [ Validators.required ]]
  });
  
  public allFacilities: Facility[] = []

  public btnText: string = 'Create';
  constructor(private fb: FormBuilder,
    private api: ApiService,
    private dialogRef:  MatDialogRef<CompareGroupCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompareGroup) {
    super();
    if (data.compareGroupId !== 0) {
      this.btnText = 'Update';
    }
  }

  public ngOnInit(): void {
    this.getFacilities();
  }

  public get name(): string {
    return this.form.get('name')?.value as string;
  }

  public get facilities(): number[] {
    return this.form.get('facilities')?.value as unknown as number[];
  }

  public getFacilities(): void {
    this.api.getFacilities()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((allFacilities: Facility[]) => {
        if (allFacilities) {
          this.allFacilities = allFacilities;
        }
      });
  }

  public onCreate(): void {
    if (this.data.compareGroupId === 0) {
      this.api.createCompareGroup(this.name, this.facilities)
        .subscribe(_ => {
          this.dialogRef.close(true);
        });
    } else {
      this.api.editCompareGroup(this.data.compareGroupId, this.name, this.facilities)
        .subscribe(_ => {
          this.dialogRef.close(true);
        });
    }
  }
}
