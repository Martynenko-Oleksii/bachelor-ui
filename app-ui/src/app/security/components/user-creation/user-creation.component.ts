import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DepartmentGroup, FacilityGroup, SecurityUser } from '../../models/access-control';
import { ApiService } from '../../services/api.service';
import { ContractsCreationComponent } from '../contracts-creation/contracts-creation.component';
import { RegisterInfo, Role, User } from 'src/app/shared/models/user';
import { IdentityService } from 'src/app/shared/services/identity.service';
import { takeUntil } from 'rxjs';

interface Data {
  facilityGroups: FacilityGroup[];
  departmentGroups: DepartmentGroup[];
  securityUser: SecurityUser;
  user: User;
  isAdding: boolean;
  customerId: number;
  customerName: string;
}

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss']
})
export class UserCreationComponent extends BaseSubscriber implements OnInit {
  public generalRoles: string[] = ['Coordinator', 'External'];
  public allRoles: Role[] = [];
  public userRoles: Role[] = [];

  public addForm = this.fb.group({
    userName: [this.data.user.userName, [Validators.required, Validators.maxLength(16)]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    firstName: [this.data.user.fullName.split(',')[1]?.trim() ?? '', [Validators.required, Validators.maxLength(32)]],
    lastName: [this.data.user.fullName.split(',')[0]?.trim() ?? '', [Validators.required, Validators.maxLength(32)]],
    facilityGroup: [this.data.securityUser.facilityGroup?.id ?? 0, [Validators.required]],
    departmentGroup: [this.data.securityUser.departmentGroup?.id ?? 0, [Validators.required]],
    generalRole: ['', [Validators.required]],
    apps: [this.userRoles.map(x => x.id), [Validators.required]]
  });

  public editForm = this.fb.group({
    firstName: [this.data.user.fullName.split(',')[1]?.trim() ?? '', [Validators.required, Validators.maxLength(32)]],
    lastName: [this.data.user.fullName.split(',')[0]?.trim() ?? '', [Validators.required, Validators.maxLength(32)]],
    facilityGroup: [this.data.securityUser.facilityGroup?.id ?? 0, [Validators.required]],
    departmentGroup: [this.data.securityUser.departmentGroup?.id ?? 0, [Validators.required]],
    generalRole: ['', [Validators.required]],
    apps: [this.userRoles.map(x => x.id), [Validators.required]]
  });

  public hide: boolean = true;
  public hideConfirm: boolean = true;

  public selectedGloabalRole: string = '';
  public selectedAppRoles: string[] = [''];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data,
    private api: ApiService,
    private dialogRef: MatDialogRef<ContractsCreationComponent>,
    private fb: FormBuilder,
    private identity: IdentityService) {
    super();
  }

  public ngOnInit(): void {
    this.getRoles();
  }

  public onSubmit(): void {
    let fgId = this.addForm.get('facilityGroup')?.value;
    let dgId = this.addForm.get('departmentGroup')?.value;

    if (this.data.isAdding) {
      let securityUser: SecurityUser = {
        userId: null,
        customerId: this.data.customerId,
        facilityGroup: this.data.facilityGroups.find(x => x.id === fgId)!,
        departmentGroup: this.data.departmentGroups.find(x => x.id === dgId)!
      }

      let registerInfo: RegisterInfo = {
        customerId: this.data.customerId,
        customerName: this.data.customerName,
        userName: this.addForm.get('userName')?.value!,
        password: this.addForm.get('password')?.value!,
        firstName: this.addForm.get('firstName')?.value!,
        lastName: this.addForm.get('lastName')?.value!,
        roles: this.addForm.get('apps')?.value!.map(x => ({
          id: x,
          name: this.allRoles.find(y => y.id === x)?.name!
        }))!
      }

      this.identity.registerUser(registerInfo)
        .subscribe((user: User) => {
          if (user) {
            securityUser.userId = user.id;
            this.api.addUser(securityUser)
              .subscribe(result => {
                this.dialogRef.close({ added: true, user: user });
              });
          }
        });
    } else {
      
    }
  }

  private getRoles(): void {
    this.identity.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles: Role[]) => {
        if (roles) {
          this.allRoles = roles;

          if (!this.data.isAdding) {
            this.getUserRoles();
          }
        }
      });
  }

  private getUserRoles(): void {
    this.identity.getUserRoles(this.data.user.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((roles: Role[]) => {
      if (roles) {
        this.userRoles = roles;
        let ids = this.userRoles.map(x => x.id);

        if (ids.includes(this.allRoles.find(x => x.name === 'security')?.id!)) {
          this.selectedGloabalRole = this.generalRoles[0];
        } else {
          this.selectedGloabalRole = this.generalRoles[1];
        }

        this.selectedAppRoles = ids;

        this.editForm.get('generalRole')?.setValue(this.selectedGloabalRole);
        this.editForm.get('apps')?.setValue(this.selectedAppRoles);
      }
    });
  }
}
