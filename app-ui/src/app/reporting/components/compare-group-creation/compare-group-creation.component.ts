import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { Facility } from '../../models/facility';
import { takeUntil } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-compare-group-creation',
  templateUrl: './compare-group-creation.component.html',
  styleUrls: ['./compare-group-creation.component.scss']
})
export class CompareGroupCreationComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    name: ['', [ Validators.required, Validators.maxLength(64) ]],
    facilities: ['', [ Validators.required ]]
  });
  
  public allFacilities: Facility[] = []

  constructor(private fb: FormBuilder, private api: ApiService, private dialogRef:  MatDialogRef<CompareGroupCreationComponent>) {
    super();
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
    this.api.createCompareGroup(this.name, this.facilities)
      .subscribe(_ => {
        this.dialogRef.close(true);
      });
  }
}
