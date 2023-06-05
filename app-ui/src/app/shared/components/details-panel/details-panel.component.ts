import { Component, Input, OnInit } from '@angular/core';
import { SelectedDataPeriod } from 'src/app/data/models/general';

export interface DetailsData {
  title: string;
  values: string[];
}

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.scss']
})
export class DetailsPanelComponent implements OnInit {

  @Input() data: DetailsData[] = [];
  @Input() displayDataPerio: boolean = false;

  public dataperiod: SelectedDataPeriod | undefined;

  public ngOnInit(): void {
    if (this.displayDataPerio) {
      this.getDataperiod();
    }
  }

  private getDataperiod(): void {
    let dataPeriodJson = localStorage.getItem('dataPeriod');
    if (dataPeriodJson) {
      this.dataperiod = JSON.parse(dataPeriodJson);
    }
  }
}
