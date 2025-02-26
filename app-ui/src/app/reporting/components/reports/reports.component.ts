import { Component, OnInit } from '@angular/core';
import { Report, reportTypeMapping, reportTypes, statusMapping } from '../../models/management';
import { ApiService } from '../../services/api.service';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthUser } from 'src/app/shared/models/user';
import { ReportingRoles } from 'src/app/shared/enums/user-roles';
import { DeleteDialogComponent, EntityType } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReportingMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends BaseSubscriber implements OnInit {
  public reportTypes = reportTypes;
  public reportTypeMapping = reportTypeMapping;
  public statusMapping = statusMapping;

  public hasSharingRole: boolean = false;
  public reports: { [key: number]: Report[] } = [];

  constructor(private api: ApiService, private auth: AuthService, private dialog: MatDialog, private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateReportingActiveMenu(ReportingMenuItem.Reports);

    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: AuthUser | null) => this.hasSharingRole = !!user && user.roles.includes(ReportingRoles.ItemSharing));

    this.getReports();
  }

  public onExportrtReport(report: Report): void {
    this.api.exportReport(report.reportId)
      .subscribe((event: HttpEvent<Blob>) => {
        if (event.type === HttpEventType.Response) {
          this.dowloadFile(event, report.name);
        }
      });
  }

  public onDelete(id: number, name: string, typeId: number): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        entityId: id,
        entityType: EntityType.Report,
        header: "Delete Report",
        message: `Would you like to delete report "${name}"?`
      },
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((added: boolean) => {
        if (added) {
          let index = this.reports[typeId].findIndex(x => x.reportId === id);
          this.reports[typeId].splice(index, 1);
        }
      });
  }

  private getReports(): void {
    this.api.getReports()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((reports: Report[]) => {
        if (reports) {
          reports.forEach((report: Report) => {
            if (!this.reports[report.reportTypeId]) {
              this.reports[report.reportTypeId] = [];
            }

            this.reports[report.reportTypeId].push(report);
          });
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
