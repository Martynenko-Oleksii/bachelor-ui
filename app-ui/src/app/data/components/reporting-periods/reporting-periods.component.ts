import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporting-periods',
  templateUrl: './reporting-periods.component.html',
  styleUrls: ['./reporting-periods.component.scss']
})
export class ReportingPeriodsComponent implements OnInit {
  private timePeriodId: number = 0;

  constructor(private shared: SharedDataService, private api: ApiService, private snackbar: MatSnackBar, private router: Router) {}

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.ReportingPeriods);

    let dataPeriodJson = localStorage.getItem('dataPeriod');
    if (dataPeriodJson) {
      let dataPeriod = JSON.parse(dataPeriodJson);
      this.timePeriodId = dataPeriod.timePeriodInfo.id;
    }
  }

  public onClosePeriod(): void {
    this.api.closeTimePeriod(this.timePeriodId)
      .subscribe(_ => {
        this.snackbar.open('Current Reporting Period has been closed', 'Ok', {
          panelClass: 'request-successed'
        });

        this.router.navigate(['/data']);

        localStorage.removeItem('dataPeriod');
        this.shared.updateDataPeriod(null);
      });
  }
}
