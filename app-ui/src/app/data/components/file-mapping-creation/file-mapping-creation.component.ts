import { Component, Inject, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileMapping, FileType } from '../../models/upload-data';
import { fileTypeColumns } from '../../models/file-types';
import { takeUntil } from 'rxjs';
import { FileTypeEnum } from '../../enums/upload-data';

@Component({
  selector: 'app-file-mapping-creation',
  templateUrl: './file-mapping-creation.component.html',
  styleUrls: ['./file-mapping-creation.component.scss']
})
export class FileMappingCreationComponent extends BaseSubscriber implements OnInit {
  public fileTypes: FileType[] = [];
  public fileTypeColumns = fileTypeColumns;

  public form = this.fb.group({
    name: [this.data.mapping.name, [Validators.required, Validators.maxLength(32)]],
    description: [this.data.mapping.description, [Validators.required, Validators.maxLength(64)]],
    fileType: [this.data.mapping.fileType?.id, [Validators.required]],
  });

  public mappingForm = this.fb.group({
    column1: ['COLUMN 1', [Validators.required]],
    column2: ['COLUMN 2', [Validators.required]],
    column3: ['COLUMN 3', [Validators.required]],
    column4: ['COLUMN 4', [Validators.required]],
    column5: ['COLUMN 5', [Validators.required]],
    column6: ['COLUMN 6', [Validators.required]],
    column7: ['COLUMN 7', [Validators.required]],
    column8: ['COLUMN 8', [Validators.required]]
  });

  public selectedFileType: FileType | undefined = this.data.mapping.fileType;

  constructor(private api: ApiService, private fb: FormBuilder, private dialogRef: DialogRef,
    @Inject(MAT_DIALOG_DATA) private data: { mapping: FileMapping, isCreation: boolean }) {
    super();
  }

  public ngOnInit(): void {
    this.getFileTypes();

    if (!this.data.isCreation) {
      this.form.get('fileType')?.disable();
    }
  }

  public onFileTypeSelected(id: number): void {
    this.selectedFileType = this.fileTypes.find(x => x.id == id);
  }

  public onSubmit(): void {
    let mapping: FileMapping = {
      id: this.data.mapping.id,
      name: this.form.get('name')?.value!,
      description: this.form.get('description')?.value!,
      mappingJson: this.getMappingJson(),
      fileType: this.selectedFileType!
    }

    console.log(mapping);

    if (this.data.isCreation) {
      this.api.createMapping(mapping)
        .subscribe(result => {
          if (result) {
            this.dialogRef.close({ added: true, mapping: result });
          }
        });
    } else {
      this.api.editMapping(mapping)
        .subscribe(_ => {
          this.dialogRef.close({ updated: true, mapping: mapping });
        });
    }
  }

  private getFileTypes(): void {
    this.api.getFileTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.fileTypes = result;
        }
      })
  }

  private getMappingJson(): string {
    let res: { [key: string]: string } = {};
    let fileTypeColumn = fileTypeColumns[this.selectedFileType!.name];
    fileTypeColumn.forEach((value, index) => {
      res[value] = this.mappingForm.get('column'+(index+1))?.value;
    });

    return JSON.stringify(res);
  }
}
