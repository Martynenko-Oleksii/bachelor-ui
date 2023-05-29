import { Component, Inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DeleteDialogData {
  header: string;
  message: string;
  endpointPath: string;
  id: string;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  constructor(private api: ApiService,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) { }

  public onDelete(): void {
    this.api.deleteEntity(this.data.endpointPath, this.data.id)
      .subscribe({
        next: _ => {
          this.dialogRef.close(true);
        },
        error: error => {
          console.log(error);
          this.dialogRef.close(false);
        }
      });
  }
}
