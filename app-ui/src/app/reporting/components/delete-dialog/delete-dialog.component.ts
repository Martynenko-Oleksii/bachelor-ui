import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';

export enum EntityType {
  Template,
  Report,
  CompareGroup
}

export interface DeleteDialogData {
  entityId: number;
  entityType: EntityType;
  header: string;
  message: string;

}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialogData,
    private api: ApiService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  public onDelete(): void {
    let path = '';
    switch (this.data.entityType) {
      case EntityType.Template:
        path = 'DeleteTemplate';
        break;
      case EntityType.Report:
        path = 'DeleteReport';
        break;
      case EntityType.CompareGroup:
        path = 'DeleteCompareGroup';
        break;
      default:
        this.dialogRef.close();
        return;
    }

    this.api.deleteEntity(path, this.data.entityId)
      .subscribe(_ => {
        this.dialogRef.close();
      });
  }
}
