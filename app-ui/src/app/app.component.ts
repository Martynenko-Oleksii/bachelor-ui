import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { BaseSubscriber } from './shared/models/base-subscriber';
import { AuthUser } from './shared/models/user';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseSubscriber implements OnInit {
  public isAuthorized: boolean = false;

  constructor(private auth: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.auth.checkAuth();

    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((user: AuthUser | null) => {
        this.isAuthorized = !!user;
      });
  }
}
