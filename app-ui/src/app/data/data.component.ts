import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from '../shared/models/base-subscriber';
import { GlobalRoles } from '../shared/enums/user-roles';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../shared/services/auth.service';
import { AuthUser } from '../shared/models/user';
import { takeUntil } from 'rxjs';
import { DetailsData } from '../shared/components/details-panel/details-panel.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent extends BaseSubscriber implements OnInit {
  private menuItem: string = 'data';

  public globalRoles: typeof GlobalRoles = GlobalRoles;

  public userRoles: string[] = [];
  public detailsData: DetailsData[] = [];

  constructor(private data: SharedDataService, private auth: AuthService, private translate: TranslateService) {
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
            title: this.translate.currentLang === 'uk-UA' ? 'Клієнт' : 'Customer',
            values: [`${user.customerId}. ${user.customer}`],
          });
        }
      });
  }
}
