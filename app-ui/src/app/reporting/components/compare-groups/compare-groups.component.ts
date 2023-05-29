import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { CompareGroup } from '../../models/management';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthUser } from 'src/app/shared/models/user';
import { ReportingRoles } from 'src/app/shared/enums/user-roles';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, EntityType } from '../delete-dialog/delete-dialog.component';
import { CompareGroupCreationComponent } from '../compare-group-creation/compare-group-creation.component';

@Component({
  selector: 'app-compare-groups',
  templateUrl: './compare-groups.component.html',
  styleUrls: ['./compare-groups.component.scss']
})
export class CompareGroupsComponent extends BaseSubscriber implements OnInit {
  public compareGroups: CompareGroup[] = [];
  public hasSharingRole: boolean = false;

  constructor(private api: ApiService, private auth: AuthService, private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: AuthUser | null) => this.hasSharingRole = !!user && user.roles.includes(ReportingRoles.ItemSharing));

    this.getCompareGroups();
  }

  public onDelete(id: number, name: string): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        entityId: id,
        entityType: EntityType.CompareGroup,
        header: "Delete Compare Group",
        message: `Would you like to delete compare group "${name}"?`
      },
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((added: boolean) => { if (added) this.getCompareGroups() });
  }

  public onCreate(): void {
    let dialogRef = this.dialog.open(CompareGroupCreationComponent, {
      data: {
        compareGroupId: 0,
        name: '',
        lastModification: Date.UTC,
        facilities: []
      },
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((added: boolean) => { if (added) this.getCompareGroups() });
  }

  public onEdit(compareGroup: CompareGroup): void {
    let dialogRef = this.dialog.open(CompareGroupCreationComponent, {
      data: compareGroup,
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((added: boolean) => { if (added) this.getCompareGroups() });
  }

  private getCompareGroups(): void {
    this.api.getCompareGroups()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((compareGroups: CompareGroup[]) => {
        if (compareGroups) {
          this.compareGroups = compareGroups;
        }
      })
  }
}
