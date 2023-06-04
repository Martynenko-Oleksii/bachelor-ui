import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../shared/services/auth.service';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from '../shared/models/base-subscriber';
import { AuthUser } from '../shared/models/user';
import { GlobalRoles } from '../shared/enums/user-roles';
import { DetailsData } from '../shared/components/details-panel/details-panel.component';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent extends BaseSubscriber implements OnInit {
  private menuItem: string = 'reporting';

  public globalRoles: typeof GlobalRoles = GlobalRoles;

  public userRoles: string[] = [];
  public detailsData: DetailsData[] = [];

  constructor(private data: SharedDataService, private auth: AuthService) {
    super();
  }
  
  public ngOnInit(): void {
    this.data.updateActiveMenu(this.menuItem);

    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((user: AuthUser | null) => {
        if (user) {
          this.userRoles = user.roles;

          this.detailsData.push({
            title: 'Customer',
            values: [`${user.customerId}. ${user.customer}`],
          });
        }
      });
  }
}
