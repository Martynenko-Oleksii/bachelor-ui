import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalRoles, ReportingRoles } from '../../enums/user-roles';
import { Router } from '@angular/router';

interface MenuMapping {
  name: string;
  items: string[];
  urls: string[];
}

const securityMenuSections: { [key: string]: MenuMapping } = {
  'access-control': {
    name: "Access Control",
    items: ["Users", "Roles", "Facility Groups", "Department Groups"],
    urls: ["users", "roles", "facility-groups", "department-groups"]
  },
  'customer-management': {
    name: "Customer Management",
    items: ["Customers", "Facilities"],
    urls: ["customers", "facilities"]
  },
  'contract-management': {
    name: "Contraact Management",
    items: ["Contracts", "Expiring Contracts"],
    urls: ["contracts", "exppiring-contracts"]
  },
  'customer-support': {
    name: "Customer Support",
    items: ["Reset Passwords", "Logs"],
    urls: ["reset-passwords", "logs"]
  }
}

const dataMenuSections: { [key: string]: MenuMapping } = {
  'data-configuration': {
    name: "Data Configuration",
    items: ["Data Period", "Cost Centers", "Mapping Templates", "Data Sets", "Accounts", "Upload Data"],
    urls: ["data-period", "cost-centers", "mapping-templates", "data-sets", "accounts", "upload-data"]
  },
  'cc-mapping': {
    name: "Cost Center Mapping",
    items: ["Map Cost Centers"],
    urls: ["cost-centers-mapping"]
  },
  'gl-pr-mapping': {
    name: "GL/PR Mapping",
    items: ["Map GL/PR Entries"],
    urls: ["gl-pr-mapping"]
  },
  'data-entry': {
    name: "Data Entry",
    items: ["Enter Data"],
    urls: ["data-entering"]
  },
  'data-administration': {
    name: "Administration",
    items: ["Unused Data", "Reportin Periods"],
    urls: ["unused-data", "reporting-periods"]
  }
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
  private startPath: string = '';

  public mapping: { [key: string]: MenuMapping } = {};

  @Input() selectedModule: GlobalRoles | undefined;
  @Input() userRoles: string[] = [];

  constructor(private router: Router) { }

  public ngOnInit(): void {
    switch (this.selectedModule) {
      case GlobalRoles.Security:
        this.startPath = 'security';
        this.mapping = securityMenuSections;
        break;
      case GlobalRoles.Data:
        this.mapping = dataMenuSections;
        this.startPath = 'data';
        break;
      case GlobalRoles.Reporting:
        this.startPath = 'reporting';
        this.mapping = reportingMenuSections;
        break;
    }
  }

  public onSelectItem(url: string): void {
    this.router.navigate([`/${this.startPath}/${url}`]);
  }
}
