import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalRoles } from 'src/app/shared/enums/user-roles';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { AuthUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MenuDict, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseSubscriber implements OnInit {
  public roles: typeof GlobalRoles = GlobalRoles;
  public userRoles: string[] = [];

  public inactiveClasses: MenuDict = {};

  constructor(private auth: AuthService, private data: SharedDataService, private router: Router) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((user: AuthUser | null) => {
        if (user) {
          this.userRoles = user.roles;
        }
      });

    this.data.menuData$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((data: MenuDict | null) => {
        if (data) {
          this.inactiveClasses = data;
        }
      })
  }

  public onClick(item: string): void {
    switch (item) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case GlobalRoles.Security:
        this.router.navigate(['/security']);
        break;
      case GlobalRoles.Data:
        this.router.navigate(['/data']);
        break;
      case GlobalRoles.Reporting:
        this.router.navigate(['/reporting']);
        break;
    }
  }
}
