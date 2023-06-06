import { Component, Input, OnInit } from '@angular/core';
import { SelectedDataPeriod } from 'src/app/data/models/general';
import { SharedDataService } from '../../services/shared-data.service';
import { BaseSubscriber } from '../../models/base-subscriber';
import { takeUntil } from 'rxjs';

export interface DetailsData {
  title: string;
  values: string[];
}

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.scss']
})
export class DetailsPanelComponent extends BaseSubscriber implements OnInit {

  @Input() data: DetailsData[] = [];
  @Input() displayDataPeriod: boolean = false;

  public dataperiod: SelectedDataPeriod | undefined;

  constructor(private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    if (this.displayDataPeriod) {
      this.getDataperiod();
    }

    this.shared.dataPeriod$
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      if (res) {
        this.dataperiod = res;
      }
    });
  }

  private getDataperiod(): void {
    let dataPeriodJson = localStorage.getItem('dataPeriod');
    if (dataPeriodJson) {
      this.dataperiod = JSON.parse(dataPeriodJson);
    }
  }
}
