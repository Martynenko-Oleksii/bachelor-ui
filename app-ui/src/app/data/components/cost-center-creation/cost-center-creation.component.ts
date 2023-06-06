import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CostCenter } from '../../models/upload-data';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cost-center-creation',
  templateUrl: './cost-center-creation.component.html',
  styleUrls: ['./cost-center-creation.component.scss']
})
export class CostCenterCreationComponent implements OnInit {
  private facilityId: number = 0;

  public form = this.fb.group({
    number: [{value: this.data.costCenter.number, disabled: !this.data.isCreation}, [Validators.required, Validators.maxLength(16)]],
    description: [this.data.costCenter.description, [Validators.required, Validators.maxLength(64)]]
  });

  constructor(private api: ApiService, private dialogRef: MatDialogRef<CostCenterCreationComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: { isCreation: boolean, costCenter: CostCenter } ) {}

  public ngOnInit(): void {
    let dataPeriodJson = localStorage.getItem('dataPeriod');
    if (dataPeriodJson) {
      let dataPeriod = JSON.parse(dataPeriodJson);
      this.facilityId = dataPeriod.facility.id;
    }
  }

  public onSubmit(): void {
    let costCenter: CostCenter = {
      number: this.form.get('number')!.value!,
      description: this.form.get('description')!.value!,
      facilityID: this.facilityId,
      department: null
    };

    if (this.data.isCreation) {
      this.api.createCostCenter(costCenter)
        .subscribe(res => {
          this.dialogRef.close({added: true, costCenter: res});
        });
    } else {
      this.api.editCostCenter(costCenter)
        .subscribe(_ => {
          this.dialogRef.close({updated: true, costCenter: costCenter});
        });
    }
  }
}
