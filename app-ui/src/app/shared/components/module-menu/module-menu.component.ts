import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalRoles, ReportingRoles } from '../../enums/user-roles';
import { Router } from '@angular/router';

interface MenuMapping {
  name: string;
  items: string[];
  urls: string[];
}

const reportingMenuSections: { [key: string]: MenuMapping } = {
  'management': {
    name: "Management",
    items: ["Templates", "Reports", "Compare Groups"],
    urls: ["templates", "reports", "compare-groups"]
  },
  'administration': {
    name: "Administration",
    items: ["Queue Monitoring", "Reports Statistics", "Data Sharing Contact"],
    urls: ["queue-monitoring", "statistic", "data-sharing-report"]
  },
  'generic-reports': {
    name: "Department",
    items: ["Facility Trend", "Facility and CG Trend"],
    urls: ["facility-trend", "facility-cg-trend"]
  },
  'department-reports': {
    name: "Generic",
    items: ["Compare Group Trend", "Comparison Details"],
    urls: ["cg-trend", "comparison-details"]
  }
}

@Component({
  selector: 'app-module-menu',
  templateUrl: './module-menu.component.html',
  styleUrls: ['./module-menu.component.scss']
})
export class ModuleMenuComponent implements OnInit {
  public mapping: { [key: string]: MenuMapping } = {};

  @Input() selectedModule: GlobalRoles | undefined;
  @Input() userRoles: string[] = [];

  constructor(private router: Router) { }

  public ngOnInit(): void {
    switch (this.selectedModule) {
      case GlobalRoles.Security:
        break;
      case GlobalRoles.Data:
        break;
      case GlobalRoles.Reporting:
        this.mapping = reportingMenuSections;
        break;
    }
  }

  public onSelectItem(url: string): void {
    this.router.navigate([`/reporting/${url}`]);
  }
}
