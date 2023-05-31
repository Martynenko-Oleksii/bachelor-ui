import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { BaseSubscriber } from './shared/models/base-subscriber';
import { AuthUser } from './shared/models/user';
import { takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserInfoComponent } from './components/update-user-info/update-user-info.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseSubscriber implements OnInit {
  public isAuthorized: boolean = false;

  constructor(private auth: AuthService, private dialog: MatDialog, private translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.auth.checkAuth();
    this.checkFirstLogin();

    this.setupLocala();
  }

  private checkFirstLogin(): void {
    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((user: AuthUser | null) => {
        this.isAuthorized = !!user;

        if (!!user && user.firstSignIn) {
          this.dialog.open(UpdateUserInfoComponent, {
            data: {
              user: user,
              firstSignIn: true,
              changePassword: false,
              updateProfile: false
            }
          })
        }
      });
  }

  private setupLocala(): void {
    this.translate.addLangs(['en-US', 'uk-UA']);
    this.translate.setDefaultLang('en-US');

    if (navigator.language.startsWith('en')) {
      this.translate.use('en-US');
    } else if (navigator.language.startsWith('uk') || navigator.language.startsWith('ru')) {
      this.translate.use('uk-UA');
    } else {
      this.translate.use('en-US');
    }
  }
}
