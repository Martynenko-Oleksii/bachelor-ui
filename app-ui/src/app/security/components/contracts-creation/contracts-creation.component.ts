import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contract } from '../../models/contracts'
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contracts-creation',
  templateUrl: './contracts-creation.component.html',
  styleUrls: ['./contracts-creation.component.scss']
})
export class ContractsCreationComponent {
  public form = this.fb.group({
    name: [this.data.contract.name, [Validators.required, Validators.maxLength(64)]],
    description: [this.data.contract.description, [Validators.required, Validators.maxLength(256)]],
    duration: [this.data.contract.duration, [Validators.required, Validators.max(60), Validators.min(12)]],
    start: [this.data.contract.start, [Validators.required, Validators.max(30), Validators.min(1)]]
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) private data: { contract: Contract, isAdding: boolean },
    private api: ApiService,
    private dialogRef: MatDialogRef<ContractsCreationComponent>,
    private fb: FormBuilder) { }

  public onSybmit(): void {
    let newContract: Contract = {
      id: this.data.contract.id,
      name: this.form.get('name')!.value!,
      description: this.form.get('description')!.value!,
      duration: this.form.get('duration')!.value!,
      start: this.form.get('start')!.value!,
    }

    if (this.data.isAdding) {
      this.api.addContract(newContract).subscribe((contract: Contract) => {
        if (contract) {
          this.dialogRef.close({ added: true, contract: contract });
        }
      });
    } else {
      this.api.editContract(newContract).subscribe(_ => {
        this.dialogRef.close({ updated: true, contract: newContract });
      });
    }
  }
}
