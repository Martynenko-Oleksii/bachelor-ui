import { Component, OnInit } from '@angular/core';
import { AuthUser, User } from 'src/app/shared/models/user';
import { Customer } from '../../models/customer-management';
import { FormBuilder, FormControl } from '@angular/forms';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';
import { Validators } from '@angular/forms';
import { IdentityService } from 'src/app/shared/services/identity.service';
import { SecurityUser } from '../../models/access-control';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SecurityMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseSubscriber implements OnInit {
  public customer = new FormControl('', [Validators.required]);
  public user = new FormControl('', [Validators.required]);

  public customers: Customer[] = [];
  public users: User[] = [];

  public changePasswordForm = this.fb.group({
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  public hideNew: boolean = true;
  public hideConfirm: boolean = true;

  public currentUser: AuthUser | null = null;

  constructor(private identity: IdentityService, private fb: FormBuilder, private auth: AuthService, private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateSecurityActiveMenu(SecurityMenuItem.ResetPasswords);

    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;

      this.getUsers(user?.customerId!);
    });
  }

  public onCustomerSelected(event: any): void {
    let option = document.getElementById(event.option.id);
    let id = parseInt(option?.attributes.getNamedItem('customer')?.value!);
  }

  public onUserSelected(event: any): void {
    console.log(event);
  }

  public onResetPassword(): void {

  }

  private getUsers(customerId: number): void {
    this.identity.getUsers(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((identityUsers: User[]) => {
        if (identityUsers) {
          if (!!this.currentUser && this.currentUser.customerId === customerId) {
            let index = identityUsers.findIndex(x => x.id === this.currentUser!.id);
            identityUsers.splice(index, 1);
          }
          
          this.users = identityUsers;
        }
      });
  }
}
