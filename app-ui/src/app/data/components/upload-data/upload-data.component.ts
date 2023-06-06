import { Component, OnInit } from '@angular/core';
import { BaseSubscriber } from 'src/app/shared/models/base-subscriber';
import { DataMenuItem, SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent extends BaseSubscriber implements OnInit {
  
  constructor(private shared: SharedDataService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.updateDataActiveMenu(DataMenuItem.UploadData);
  }
}
