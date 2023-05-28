import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { CompareGroup } from '../../models/management';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthUser } from 'src/app/shared/models/user';
import { ReportingRoles } from 'src/app/shared/enums/user-roles';

@Component({
  selector: 'app-compare-groups',
  templateUrl: './compare-groups.component.html',
  styleUrls: ['./compare-groups.component.scss']
})
export class CompareGroupsComponent extends BaseSubscriber implements OnInit {
  public compareGroups: CompareGroup[] = [];
  public hasSharingRole: boolean = false;

  constructor(private api: ApiService, private auth: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: AuthUser | null) => this.hasSharingRole = !!user && user.roles.includes(ReportingRoles.ItemSharing));

    this.getCompareGroups();
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
