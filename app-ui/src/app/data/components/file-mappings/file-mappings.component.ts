import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { SharedDataService, DataMenuItem } from 'src/app/shared/services/shared-data.service';
import { FileMapping, FileType } from '../../models/upload-data';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FileMappingCreationComponent } from '../file-mapping-creation/file-mapping-creation.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-file-mappings',
  templateUrl: './file-mappings.component.html',
  styleUrls: ['./file-mappings.component.scss']
})
export class FileMappingsComponent extends BaseSubscriber implements OnInit {
  public fileTypes: FileType[] = [];
  public mappings: { [key: string]: FileMapping[] } = {};

  constructor(private shared: SharedDataService, private api: ApiService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.MappingTemplates);

    this.getMappings();
  }

  public onCreate(): void {
    let dialogRef = this.dialog.open(FileMappingCreationComponent, {
      data: {
        isCreation: true,
        mapping: {
          id: 0,
          name: '',
          description: '',
          fileType: undefined
        }
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res && res.added) {
        console.log(res.mapping);
        if (!this.mappings[res.mapping.fileType.name]) {
          this.mappings[res.mapping.fileType.name] = [];
        }

        this.mappings[res.mapping.fileType.name].push(res.mapping);
      }
    });
  }

  public onEdit(mapping: FileMapping): void {
    let dialogRef = this.dialog.open(FileMappingCreationComponent, {
      data: {
        isCreation: false,
        mapping: mapping
      }
    });
  }

  public onDelete(id: number, name: string, type: string): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: "Delete Mapping",
        message: `Would you like to delete mapping '${name}?'`,
        endpointPath: "fileMappings",
        id: id.toString()
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const index = this.mappings[type].findIndex(x => x.id == id);
        if (index > -1) {
          this.mappings[type].splice(index, 1);
        }
      }
    });
  }

  private getMappings(): void {
    this.api.getMappings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: FileMapping[]) => {
        if (result) {
          result.forEach((mapping: FileMapping) => {
            if (!this.mappings[mapping.fileType.name]) {
              this.mappings[mapping.fileType.name] = [];
              this.fileTypes.push(mapping.fileType);
            }

            this.mappings[mapping.fileType.name].push(mapping);
          });
        }
      })
  }
}
