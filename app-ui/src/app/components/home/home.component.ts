import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private menuItem: string = 'home';

  constructor(private data: SharedDataService) { }

  public ngOnInit(): void {
    this.data.updateActiveMenu(this.menuItem);
  }
}
