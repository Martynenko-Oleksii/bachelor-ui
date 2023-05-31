import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthUser, ProfileInfo } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { IdentityService } from 'src/app/shared/services/identity.service';

export interface UpdateUserInfo {
  user: AuthUser;

  firstSignIn: boolean;
  changePassword: boolean;
  updateProfile: boolean;
}

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.component.html',
  styleUrls: ['./update-user-info.component.scss']
})
export class UpdateUserInfoComponent implements OnInit {
  public firstSignInForm = this.fb.group({
    firstName: [this.data.user.firstName],
    lastName: [this.data.user.lastName],
    email: [this.data.user.email, [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  public updateProfileForm = this.fb.group({
    firstName: [this.data.user.firstName],
    lastName: [this.data.user.lastName],
    email: [this.data.user.email, [Validators.required, Validators.email]],
  });

  public changePasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  public header: string = '';

  public hideCurrent: boolean = true;
  public hideNew: boolean = true;
  public hideConfirm: boolean = true;

  constructor(private dialogRef: MatDialogRef<UpdateUserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateUserInfo,
    private identity: IdentityService,
    private auth: AuthService,
    private fb: FormBuilder,
    private transalte: TranslateService) { }

  public ngOnInit(): void {
      if (this.data.firstSignIn) {
        this.header = this.transalte.instant('update_user_info.header1');
      } else if (this.data.updateProfile) {
        this.header = this.transalte.instant('update_user_info.header2');
      } else if (this.data.changePassword) {
        this.header = this.transalte.instant('update_user_info.header3');
      }
  }

  public onFirstSignIn(): void {
    let profileInfo: ProfileInfo = {
      firstName: this.firstSignInForm.get('firstName')!.value!,
      lastName: this.firstSignInForm.get('lastName')!.value!,
      email: this.firstSignInForm.get('email')!.value!,
      oldPassword: '',
      password: this.firstSignInForm.get('newPassword')!.value!,
    }

    this.identity.setInitilUserInfo(profileInfo)
      .subscribe({
        next: result => {
          if (!!result && result.updated) {
            // this.data.user.firstName = profileInfo.firstName;
            // this.data.user.lastName = profileInfo.lastName;
            // this.data.user.email = profileInfo.email;
            // this.data.user.firstSignIn = false;

            // this.auth.saveCurrentUser(this.data.user)
            this.auth.login();
          };
          this.dialogRef.close();
        },
        error: error => {
          console.log(error);
          this.dialogRef.close();
        }
      });
  }

  public onUpdateProfile(): void {
    let profileInfo: ProfileInfo = {
      firstName: this.updateProfileForm.get('firstName')!.value!,
      lastName: this.updateProfileForm.get('lastName')!.value!,
      email: this.updateProfileForm.get('email')!.value!,
      oldPassword: '',
      password: '',
    }

    this.identity.updateUserInfo(profileInfo)
      .subscribe({
        next: result => {
          if (!!result && result.updated) {
            this.auth.login();
          };
          this.dialogRef.close();
        },
        error: error => {
          console.log(error);
          this.dialogRef.close();
        }
      });
  }

  public onChangePassword(): void {
    let profileInfo: ProfileInfo = {
      firstName: '',
      lastName: '',
      email: '',
      oldPassword: this.changePasswordForm.get('currentPassword')!.value!,
      password: this.changePasswordForm.get('newPassword')!.value!,
    }

    this.identity.changePassword(profileInfo)
      .subscribe({
        next: result => {
          if (!!result && result.updated) {
            this.auth.login();
          };
          this.dialogRef.close();
        },
        error: error => {
          console.log(error);
          this.dialogRef.close();
        }
      });
  }
}
