import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FileMapping, FileType } from '../../models/upload-data';
import { takeUntil } from 'rxjs';
import { ColumnDelimeter, FileTypeEnum } from '../../enums/upload-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent extends BaseSubscriber implements OnInit {
  private formData: FormData = new FormData();

  public delimeter: typeof ColumnDelimeter = ColumnDelimeter;
  public fileTypes: FileType[] = [];
  public mappings: { [key: string]: FileMapping[] } = {};

  public form = this.fb.group({
    fileType: [null, [Validators.required]],
    delimeter: [null, [Validators.required]],
    mapping: [{value: null, disabled: true}, [Validators.required]],
    dataSetName: [{value: '', disabled: true}]
  });

  public currentTimePeriodId: number = 0;
  public selectedFileType: FileType | undefined;
  public fileName: string | undefined;

  constructor(private shared: SharedDataService, private api: ApiService, private fb: FormBuilder, private router: Router) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.UploadData);

    this.getFileTypes();
    this.getFileMappings();

    let currentPeriod = localStorage.getItem('dataPeriod');
    if (currentPeriod) {
      let res = JSON.parse(currentPeriod);
      this.currentTimePeriodId = res.timePeriodInfo.id;
    }
  }

  public onFileTypeSelected(id: number): void {
    this.selectedFileType = this.fileTypes.find(x => x.id == id);
    this.form.get('mapping')?.enable();

    if (this.selectedFileType?.name == FileTypeEnum.GLData || this.selectedFileType?.name == FileTypeEnum.PRData) {
      this.form.get('dataSetName')?.enable();
      this.form.get('dataSetName')?.setValidators([Validators.required]);
    } else {
      this.form.get('dataSetName')?.disable();
      this.form.get('dataSetName')?.removeValidators([Validators.required]);
    }
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.formData.append('file', file);
    }
  }

  public onSubmit(): void {
    this.formData.append('delimiter', this.form.get('delimeter')!.value!);
    this.formData.append('mappingId', this.form.get('mapping')!.value!);
    this.formData.append('timePeriodId', this.currentTimePeriodId.toString());
    this.formData.append('dataSet', this.form.get('dataSetName')!.value!);

    this.formData.forEach((value, key) => {
      console.log(key);
      console.log(value);
    });

    // this.api.uploadData(this.formData)
    //   .subscribe(res => {
    //     if (res) {
    //       if (res.length === 0) {
    //         this.router.navigate(['/data/upload-data']);
    //       }
    //     }
    //   });
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

  private getFileMappings(): void {
    this.api.getMappings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          result.forEach((mapping: FileMapping) => {
            if (!this.mappings[mapping.fileType.name]) {
              this.mappings[mapping.fileType.name] = [];
            }

            this.mappings[mapping.fileType.name].push(mapping);
          });
        }
      })
  }
}
