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

  constructor(private api: ApiService, private auth: AuthService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: AuthUser | null) => this.hasSharingRole = !!user && user.roles.includes(ReportingRoles.ItemSharing));

    this.getTemplates();
  }

  public onDelete(id: number, name: string): void {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        entityId: id,
        entityType: EntityType.Template,
        header: "Delete Template",
        message: `Would you like to delete template "${name}"?`
      },
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
