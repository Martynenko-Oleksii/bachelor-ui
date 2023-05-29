import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../../models/customer-management';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contract } from '../../models/contracts';
import { ApiService } from '../../services/api.service';
import { ContractsCreationComponent } from '../contracts-creation/contracts-creation.component';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';

@Component({
  selector: 'app-customers-creation',
  templateUrl: './customers-creation.component.html',
  styleUrls: ['./customers-creation.component.scss']
})
export class CustomersCreationComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    name: [this.data.customer.name, [Validators.required, Validators.maxLength(64)]],
    description: [this.data.customer.description, [Validators.required, Validators.maxLength(256)]],
    autoRenewal: [this.data.customer.autoRenewal],
    contract: [this.data.customer.contract.id, [Validators.required]]
  });
  
  public contracts: Contract[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: { customer: Customer, isAdding: boolean },
    private api: ApiService,
    private dialogRef: MatDialogRef<ContractsCreationComponent>,
    private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.api.getContracts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((contracts: Contract[]) => this.contracts = contracts);
  }

  public onSybmit(): void {
    let newCustomer: Customer = {
      id: this.data.customer.id,
      name: this.form.get('name')!.value!,
      description: this.form.get('description')!.value!,
      autoRenewal: this.form.get('autoRenewal')!.value!,
      contract: this.contracts.find(x => x.id == this.form.get('contract')!.value!)!,
      activationDate: new Date(),
      expiringDate: new Date(),
    }

    if (this.data.isAdding) {
      this.api.addCustomer(newCustomer).subscribe((customer: Customer) => {
        if (customer) {
          this.dialogRef.close({ added: true, customer: customer });
        }
      });
    } else {
      this.api.editCUstomer(newCustomer).subscribe(_ => {
        this.dialogRef.close({ updated: true, customer: newCustomer });
      });
    }
  }
}
