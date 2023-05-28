import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { CompareGroup } from '../../models/management';
import { ApiService } from '../../services/api.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-compare-groups',
  templateUrl: './compare-groups.component.html',
  styleUrls: ['./compare-groups.component.scss']
})
export class CompareGroupsComponent extends BaseSubscriber implements OnInit {
  public compareGroups: CompareGroup[] = [];

  constructor(private api: ApiService) {
    super();
  }

  public ngOnInit(): void {
    this.getCompareGroups();
  }

  private getCompareGroups(): void {
    this.api.getCompareGroups()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((compareGroups: CompareGroup[]) => {
        if (compareGroups) {
          this.compareGroups = compareGroups;
        }
      })
  }
}
