import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalRoles } from 'src/app/shared/enums/user-roles';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { AuthUser } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MenuDict, SharedDataService } from 'src/app/shared/services/shared-data.service';
import { UpdateUserInfoComponent } from '../update-user-info/update-user-info.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseSubscriber implements OnInit {
  private user: AuthUser | null = null;

  public roles: typeof GlobalRoles = GlobalRoles;
  public userRoles: string[] = [];
  public userName: string = '';

  public inactiveClasses: MenuDict = {};

  constructor(private auth: AuthService,
    private data: SharedDataService,
    private router: Router,
    private dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((user: AuthUser | null) => {
        if (user) {
          this.user = user;
          this.userRoles = user.roles;
          this.userName = user.userName;
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

  public onUpdateProfile(): void {
    this.dialog.open(UpdateUserInfoComponent, {
      data: {
        user: this.user,
        firstSignIn: false,
        changePassword: false,
        updateProfile: true
      }
    })
  }

  public onChangePassword(): void {
    this.dialog.open(UpdateUserInfoComponent, {
      data: {
        user: this.user,
        firstSignIn: false,
        changePassword: true,
        updateProfile: false
      }
    })
  }

  public onLogOut(): void {
    this.auth.logout();
  }
}
