import { Component, Input } from '@angular/core';

export interface DetailsData {
  title: string;
  values: string[];
}

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.scss']
})
export class DetailsPanelComponent {

  @Input() data: DetailsData[] | undefined;
}
