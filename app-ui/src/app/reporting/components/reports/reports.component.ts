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

  constructor(private api: ApiService, private auth: AuthService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: AuthUser | null) => this.hasSharingRole = !!user && user.roles.includes(ReportingRoles.ItemSharing));

    this.getReports();
  }

  public onDelete(id: number, name: string): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        entityId: id,
        entityType: EntityType.Report,
        header: "Delete Report",
        message: `Would you like to delete report "${name}"?`
      },
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((added: boolean) => { if (added) this.getReports() });
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
}
