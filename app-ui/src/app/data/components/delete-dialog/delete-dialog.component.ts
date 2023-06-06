import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogData } from 'src/app/security/components/delete-dialog/delete-dialog.component';
import { ApiService } from '../../services/api.service';

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
    this.api.deleteEntity(`${this.data.endpointPath}/${this.data.id}`)
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
