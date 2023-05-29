import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from '../shared/models/base-subscriber';
import { GlobalRoles } from '../shared/enums/user-roles';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../shared/services/auth.service';
import { AuthUser } from '../shared/models/user';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent extends BaseSubscriber implements OnInit {
  private menuItem: string = 'data';

  public globalRoles: typeof GlobalRoles = GlobalRoles;

  public userRoles: string[] = [];

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
        }
      });
  }
}
