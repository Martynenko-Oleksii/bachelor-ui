import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ApiService } from '../../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Facility, SelectedDataPeriod, TimePeriodInfo } from '../../models/general';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-period-selection',
  templateUrl: './period-selection.component.html',
  styleUrls: ['./period-selection.component.scss']
})
export class PeriodSelectionComponent extends BaseSubscriber implements OnInit {
  public form = this.fb.group({ 
    facility: [null, [Validators.required]],
    timePeriod: [{value: null, disabled: true}, [Validators.required]]
  });

  public facilities: Facility[] = [];
  public timePeriods: TimePeriodInfo[] = [];

  constructor(private shared: SharedDataService, private api: ApiService, private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.DataPeriod);5

    this.getFacilities();
  }

  public onSelectFacility(id: number): void {
    this.getTimePeriods(id);
  }

  public saveDataPeriod(): void {
    let dataPeriod: SelectedDataPeriod = {
      timePeriodInfo: this.form.get('facility')!.value!,
      facility: this.form.get('timePeriod')!.value!,
    };

    localStorage.setItem('dataPeriod', JSON.stringify(dataPeriod));
  }

  private getFacilities(): void {
    this.api.getfacilities()
      .pipe(takeUntil(this.destroy$))
      .subscribe((facilities: Facility[]) => {
        if (facilities) {
          this.facilities = facilities;
        }
      });
  }

  private getTimePeriods(id: number): void {
    this.api.getTimePeriods(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((periods: TimePeriodInfo[]) => {
        if (periods) {
          this.timePeriods = periods;
        }
      });
  }
}
