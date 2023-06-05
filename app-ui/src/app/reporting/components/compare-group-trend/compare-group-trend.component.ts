import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ReportingMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TrimLevel } from '../../enums/reporting';
import { Department, Measure, TimePeriod } from '../../models/parameters';
import { takeUntil } from 'rxjs';
import { CompareGroup } from '../../models/management';
import { CompareGroupTrendReport } from '../../models/reports';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-compare-group-trend',
  templateUrl: './compare-group-trend.component.html',
  styleUrls: ['./compare-group-trend.component.scss']
})
export class CompareGroupTrendComponent extends BaseSubscriber implements OnInit {
  public trimLevel: typeof TrimLevel = TrimLevel;
  public step: number = 1;

  public form = this.fb.group({
    periodType: ['', [Validators.required]],
    timePeriod: [{value: null, disabled: true}, [Validators.required]],
    standardDepartment: [null, [Validators.required]],
    department: [{value: null, disabled: true}, [Validators.required]],

    compareGroups: [[], [Validators.required]],

    measure: [{value: null, disabled: true}, [Validators.required]],
    numberOfTimePeriods: [1, [Validators.required]],
    trimLevel: [TrimLevel.StdDev1, [Validators.required]],
    percentile1: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
    percentile2: [{value: null, disabled: true}, [Validators.min(1), Validators.max(99)]],
    percentile3: [{value: null, disabled: true}, [Validators.min(1), Validators.max(99)]],

    reportName: ['', [Validators.required, Validators.maxLength(64)]],
    includeReportSummary: [false],
    saveTemplate: [true],
    runReport: [false],
    runAndViewReport: [false]
  });

  public standardDepartments: Department[] = [];
  public timePeriods: TimePeriod[] = [];
  public departments: Department[] = [];
  public measures: Measure[] = [];

  public compareGroups: CompareGroup[] = [];

  constructor(private shared: SharedDataService, private api: ApiService, private fb: FormBuilder, private router: Router) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateReportingActiveMenu(ReportingMenuItem.CompareGroupTrend);

    this.getStandardDepartment();
    this.getCompareGroups();
  }

  public setStep(step: number): void {
    this.step = step;

    if (step === 3) {
      let compareGroups = this.form.get('compareGroups')?.value as unknown as number[];
      if (compareGroups && compareGroups.length === 1) {
        this.form.get('percentile2')?.enable();
        this.form.get('percentile3')?.enable();
      } else {
        this.form.get('percentile2')?.disable();
        this.form.get('percentile3')?.disable();
      }
    }
  }

  public onPeriodTypeChange(value: any): void {
    this.api.getTimePeriods(value).pipe(takeUntil(this.destroy$))
      .subscribe((timePeriods: TimePeriod[]) => {
        if (timePeriods) {
          this.timePeriods = timePeriods;
          this.form.get('timePeriod')?.enable();
        }
      });
  }

  public onSelectStandardDepartment(id: number): void {
    this.api.getDepartmentByStandardDepartmentId(id).pipe(takeUntil(this.destroy$))
      .subscribe((departments: Department[]) => {
        if (departments) {
          this.departments = departments;
          this.form.get('department')?.enable();
        }
      });
  }

  public onSelectDepartment(id: number): void {
    this.api.getMeasuresByDepartmentId(id).pipe(takeUntil(this.destroy$))
      .subscribe((measures: Measure[]) => {
        if (measures) {
          this.measures = measures;
          this.form.get('measure')?.enable();
        }
      })
  }

  public onCreate(): void {
    let report: CompareGroupTrendReport = {
      cgt: {
        timePeriodType: this.form.get('periodType')!.value!,
        timePeriod: this.form.get('timePeriod')!.value!,
        standardDepartament: this.form.get('standardDepartment')!.value!,
        departament:this.form.get('department')!.value!,
        compareGroups: this.form.get('compareGroups')!.value!,
        trimLevel: this.form.get('trimLevel')!.value!,
        percentile1: this.form.get('percentile1')!.value!,
        percentile2: this.form.get('percentile2')!.value ?? 0,
        percentile3: this.form.get('percentile3')!.value ?? 0,
        numberOfTimePeriods: this.form.get('numberOfTimePeriods')!.value!,
        measure: this.form.get('measure')!.value!,
      },
      gri: {
        reportName: this.form.get('reportName')!.value!,
        saveTemplate: this.form.get('saveTemplate')!.value!,
        runReport: this.form.get('runReport')!.value!,
        runAndViewReport: this.form.get('runAndViewReport')!.value!,
        includeReportSummarySection: this.form.get('includeReportSummary')!.value!,
      }
    };

    if (report.gri.runAndViewReport) {
      this.api.createCompareGroupTrendReport(report)
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          if (event.type === HttpEventType.Response) {
            this.dowloadFile(event, report.gri.reportName);
            this.router.navigate(['/reporting/reports']);
          }
        });
    } else {
      this.api.createCompareGroupTrendTemplate(report)
        .subscribe(_ => {
          this.router.navigate(['/reporting/templates']);
        });
    }
  }

  private getStandardDepartment(): void {
    this.api.getDepartments().pipe(takeUntil(this.destroy$))
      .subscribe((standardDepartments: Department[]) => {
        if (standardDepartments) {
          this.standardDepartments = standardDepartments;
        }
      });
  }

  private getCompareGroups(): void {
    this.api.getCompareGroups().pipe(takeUntil(this.destroy$))
      .subscribe((compareGroups: CompareGroup[]) => {
        if (compareGroups) {
          this.compareGroups = compareGroups;
        }
      })
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
