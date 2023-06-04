import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { CompareGroup } from '../../models/management';
import { Department } from '../../models/deparatment';
import { takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { DataSharingContactReport } from '../../models/reports';
import { ReportingMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-data-sharing-contact',
  templateUrl: './data-sharing-contact.component.html',
  styleUrls: ['./data-sharing-contact.component.scss']
})
export class DataSharingContactComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({
    compareGroup: [null],
    department: [null],
    name: ['', [Validators.required, Validators.maxLength(64)] ]
  });

  public compareGroups: CompareGroup[] = [];
  public departments: Department[] = []
  
  constructor(private api: ApiService, private fb: FormBuilder, private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateReportingActiveMenu(ReportingMenuItem.DataSharingReport);
    
    this.getCompareGroups();
    this.getDepartments();
  }

  public get compareGroup(): number | null {
    return this.form.get('compareGroup')?.value as unknown as number | null;
  }

  public get department(): number | null {
    return this.form.get('department')?.value as unknown as number | null;
  }

  public get name(): string {
    return this.form.get('name')?.value as string;
  }

  public onCreate(): void {
    let data: DataSharingContactReport = {
      name: this.name,
      compareGroup: this.compareGroup,
      standardDepartment: this.department
    }
    this.api.createDataSharingContactReport(data)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((event: HttpEvent<Blob>) => {
        if (event.type === HttpEventType.Response) {
          this.dowloadFile(event, this.name);
        }
      })
  }

  private getCompareGroups(): void {
    this.api.getCompareGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((compareGroups: CompareGroup[]) => {
        if (compareGroups) {
          this.compareGroups = compareGroups;
          
          if (compareGroups.length === 0) {
            this.form.get('compareGroup')?.disable();
          }
        } else {
          this.form.get('compareGroup')?.disable();
        }
      });
  }

  private getDepartments(): void {
    this.api.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((departments: Department[]) => {
        if (departments) {
          this.departments = departments;

          if (departments.length === 0) {
            this.form.get('department')?.disable();
          }
        } else {
          this.form.get('department')?.disable();
        }
      });
  }
  
  private dowloadFile(fileData: HttpResponse<Blob>, fileName: string): void {
    const downloadFile = new Blob([fileData.body!], { type: fileData.body!.type });

    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.download = `${fileName}.pdf`;
    anchor.href = URL.createObjectURL(downloadFile);
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    
    anchor.click();
    document.body.removeChild(anchor);
  }
}
