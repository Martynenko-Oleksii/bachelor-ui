import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Account, CostCenter } from '../../models/upload-data';
import { ApiService } from '../../services/api.service';
import { CostCenterCreationComponent } from '../cost-center-creation/cost-center-creation.component';
import { AccountSource } from '../../models/upload-data';
import { accountTypes } from '../../models/upload-data';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.scss']
})
export class AccountCreationComponent implements OnInit {
  private facilityId: number = 0;

  public accountSource: typeof AccountSource = AccountSource;
  public types: string[] = [];

  public form = this.fb.group({
    code: [{value: this.data.account.code, disabled: !this.data.isCreation}, [Validators.required, Validators.maxLength(16)]],
    description: [this.data.account.description, [Validators.required, Validators.maxLength(64)]],
    source: [{value: this.data.account.source, disabled: !this.data.isCreation}, [Validators.required]],
    type: [{value: this.data.account.type, disabled: !this.data.isCreation}, [Validators.required]]
  });

  constructor(private api: ApiService, private dialogRef: MatDialogRef<CostCenterCreationComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: { isCreation: boolean, account: Account } ) {}

  public ngOnInit(): void {
    let dataPeriodJson = localStorage.getItem('dataPeriod');
    if (dataPeriodJson) {
      let dataPeriod = JSON.parse(dataPeriodJson);
      this.facilityId = dataPeriod.facility.id;
    }
  }

  public onSourceSelect(source: AccountSource): void {
    this.types = accountTypes[source];
  }

  public onSubmit(): void {
    let account: Account = {
      code: this.form.get('code')!.value!,
      description: this.form.get('description')!.value!,
      source: this.form.get('source')!.value!,
      type: this.form.get('type')!.value!,
      facilityId: this.facilityId
    };

    if (this.data.isCreation) {
      this.api.createAccount(account)
        .subscribe(res => {
          this.dialogRef.close({added: true, account: res});
        });
    } else {
      this.api.editAccount(account)
        .subscribe(_ => {
          this.dialogRef.close({updated: true, account: account});
        });
    }
  }

}
