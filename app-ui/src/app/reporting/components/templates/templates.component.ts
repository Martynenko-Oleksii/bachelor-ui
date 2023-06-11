import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { Template, reportTypeMapping, reportTypes, statusMapping } from '../../models/management';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthUser } from 'src/app/shared/models/user';
import { ReportingRoles } from 'src/app/shared/enums/user-roles';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, EntityType } from '../delete-dialog/delete-dialog.component';
import { ReportingMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent extends BaseSubscriber implements OnInit {
  public reportTypes = reportTypes;
  public reportTypeMapping = reportTypeMapping;
  public statusMapping = statusMapping;

  public hasSharingRole: boolean = false;
  public templates: { [key: number]: Template[] } = [];

  constructor(private api: ApiService, private auth: AuthService, private dialog: MatDialog, private shared: SharedDataService, private router: Router) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateReportingActiveMenu(ReportingMenuItem.Templates);
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: AuthUser | null) => this.hasSharingRole = !!user && user.roles.includes(ReportingRoles.ItemSharing));

    this.getTemplates();
  }

  public onRunReport(template: Template): void {
    this.api.runReport(template.reportTypeId, template.templateId, template.name)
      .subscribe(_ => {
        this.router.navigate(['/reporting/reports']);
      });
  }
  
  public onDelete(id: number, name: string, typeId: number): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        entityId: id,
        entityType: EntityType.Template,
        header: "Delete Template",
        message: `Would you like to delete template "${name}"?`
      },
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          let index = this.templates[typeId].findIndex(x => x.templateId === id);
          this.templates[typeId].splice(index, 1);
        }
      });
  }

  private getTemplates(): void {
    this.api.getTemplates()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((templates: Template[]) => {
        if (templates) {
          templates.forEach((template: Template) => {
            if (!this.templates[template.reportTypeId]) {
              this.templates[template.reportTypeId] = [];
            }

            this.templates[template.reportTypeId].push(template);
          });
        }
      })
  }
}
