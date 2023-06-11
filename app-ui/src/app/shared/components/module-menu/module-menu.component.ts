import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalRoles, ReportingRoles } from '../../enums/user-roles';
import { Router } from '@angular/router';
import { MenuDict, SharedDataService } from '../../services/shared-data.service';
import { takeUntil } from 'rxjs';
import { BaseSubscriber } from '../../models/base-subscriber';
import { TranslateService } from '@ngx-translate/core';

interface MenuMapping {
  name: string;
  items: string[];
  urls: string[];
}

const securityMenuSections: { [key: string]: MenuMapping } = {
  'access-control': {
    name: "Access Control",
    items: ["Users", "Facility Groups", "Department Groups"],
    urls: ["users", "facility-groups", "department-groups"],
  },
  'customer-management': {
    name: "Customer Management",
    items: ["Customers", "Facilities"],
    urls: ["customers", "facilities"],
  },
  'contract-management': {
    name: "Contraact Management",
    items: ["Contracts", "Expiring Contracts"],
    urls: ["contracts", "expiring-contracts"],
  },
  'customer-support': {
    name: "Customer Support",
    items: ["Reset Passwords", "Logs"],
    urls: ["reset-passwords", "logs"],
  }
}

const securityMenuSectionsUA: { [key: string]: MenuMapping } = {
  'access-control': {
    name: "Управління доступом",
    items: ["Користувачі", "Групи мед. закладів", "Групи відділів"],
    urls: ["users", "facility-groups", "department-groups"],
  },
  'customer-management': {
    name: "Управління клієнтами",
    items: ["Клієнти", "Мед. заклади"],
    urls: ["customers", "facilities"],
  },
  'contract-management': {
    name: "Управління контрактами",
    items: ["Контракти", "Контракти, що закінчуються"],
    urls: ["contracts", "expiring-contracts"],
  },
  'customer-support': {
    name: "Підтримка клієнтів",
    items: ["Зброс паролів", "Логи"],
    urls: ["reset-passwords", "logs"],
  }
}

const dataMenuSections: { [key: string]: MenuMapping } = {
  'data-configuration': {
    name: "Data Configuration",
    // items: ["Data Period", "Cost Centers", "Mapping Templates", "Data Sets", "Accounts", "Upload Data"],
    // urls: ["data-period", "cost-centers", "mapping-templates", "data-sets", "accounts", "upload-data"],
    items: ["Data Period", "Cost Centers", "Mapping Templates", "Accounts", "Upload Data"],
    urls: ["data-period", "cost-centers", "mapping-templates", "accounts", "upload-data"],
  },
  'cc-mapping': {
    name: "Cost Center Mapping",
    items: ["Map Cost Centers"],
    urls: ["cost-centers-mapping"],
  },
  'gl-pr-mapping': {
    name: "GL/PR Mapping",
    items: ["Map GL/PR Entries"],
    urls: ["gl-pr-mapping"],
  },
  // 'data-entry': {
  //   name: "Data Entry",
  //   items: ["Enter Data"],
  //   urls: ["data-entering"],
  // },
  'data-administration': {
    name: "Administration",
    // items: ["Unused Data", "Reporting Periods"],
    // urls: ["unused-data", "reporting-periods"],
    items: ["Reporting Periods"],
    urls: ["reporting-periods"],
  }
}

const dataMenuSectionsUA: { [key: string]: MenuMapping } = {
  'data-configuration': {
    name: "Конфігурація даних",
    // items: ["Data Period", "Cost Centers", "Mapping Templates", "Data Sets", "Accounts", "Upload Data"],
    // urls: ["data-period", "cost-centers", "mapping-templates", "data-sets", "accounts", "upload-data"],
    items: ["Період звітування", "Центри витрат", "Шаблони мапінгу", "Рахунки", "Завантаження Даних"],
    urls: ["data-period", "cost-centers", "mapping-templates", "accounts", "upload-data"],
  },
  'cc-mapping': {
    name: "Мапінг центрів витрат",
    items: ["Мапінг центрів витрат"],
    urls: ["cost-centers-mapping"],
  },
  'gl-pr-mapping': {
    name: "GL/PR мапінг",
    items: ["Мапінг GL/PR сутностей"],
    urls: ["gl-pr-mapping"],
  },
  // 'data-entry': {
  //   name: "Data Entry",
  //   items: ["Enter Data"],
  //   urls: ["data-entering"],
  // },
  'data-administration': {
    name: "Адміністрування",
    // items: ["Unused Data", "Reporting Periods"],
    // urls: ["unused-data", "reporting-periods"],
    items: ["Періоди звітності"],
    urls: ["reporting-periods"],
  }
}

const reportingMenuSections: { [key: string]: MenuMapping } = {
  'management': {
    name: "Management",
    items: ["Templates", "Reports", "Compare Groups"],
    urls: ["templates", "reports", "compare-groups"],
  },
  'administration': {
    name: "Administration",
    //items: ["Queue Monitoring", "Reports Statistics", "Data Sharing Contact"],
    //urls: ["queue-monitoring", "statistic", "data-sharing-report"],
    items: ["Data Sharing Contact"],
    urls: ["data-sharing-report"],
  },
  // 'department-reports': {
  //   name: "Department",
  //   items: ["Facility Trend", "Facility and CG Trend"],
  //   urls: ["facility-trend", "facility-cg-trend"],
  // },
  'generic-reports': {
    name: "Generic",
    // items: ["Compare Group Trend", "Comparison Details"],
    // urls: ["cg-trend", "comparison-details"],
    items: ["Compare Group Trend"],
    urls: ["cg-trend"],
  }
}

const reportingMenuSectionsUA: { [key: string]: MenuMapping } = {
  'management': {
    name: "Управління",
    items: ["Шаблони", "Звіти", "Порівняльні групи"],
    urls: ["templates", "reports", "compare-groups"],
  },
  'administration': {
    name: "Адміністрування",
    //items: ["Queue Monitoring", "Reports Statistics", "Data Sharing Contact"],
    //urls: ["queue-monitoring", "statistic", "data-sharing-report"],
    items: ["Обмін контактними даними"],
    urls: ["data-sharing-report"],
  },
  // 'department-reports': {
  //   name: "Department",
  //   items: ["Facility Trend", "Facility and CG Trend"],
  //   urls: ["facility-trend", "facility-cg-trend"],
  // },
  'generic-reports': {
    name: "Загальні звіти",
    // items: ["Compare Group Trend", "Comparison Details"],
    // urls: ["cg-trend", "comparison-details"],
    items: ["Тенденції у порівняльній групі"],
    urls: ["cg-trend"],
  }
}

@Component({
  selector: 'app-module-menu',
  templateUrl: './module-menu.component.html',
  styleUrls: ['./module-menu.component.scss']
})
export class ModuleMenuComponent extends BaseSubscriber implements OnInit {
  private startPath: string = '';
  private moduleSelected: boolean = false;

  public mapping: { [key: string]: MenuMapping } = {};
  public menuDict: MenuDict = {};

  @Input() selectedModule: GlobalRoles | undefined;
  @Input() userRoles: string[] = [];

  constructor(private router: Router, private shared: SharedDataService, private translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.shared.securityMenuData$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.menuDict = res;
        this.moduleSelected = true;
      }
    });

    this.shared.reportingMenuData$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.menuDict = res;
        this.moduleSelected = true;
      }
    });

    this.shared.dataMenuData$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.menuDict = res;
        this.moduleSelected = true;
      }
    });

    switch (this.selectedModule) {
      case GlobalRoles.Security:
        this.startPath = 'security';
        if (this.translate.currentLang === 'uk-UA') this.mapping = securityMenuSectionsUA;
        else this.mapping = securityMenuSections;
        break;
      case GlobalRoles.Data:
        if (this.translate.currentLang === 'uk-UA') this.mapping = dataMenuSectionsUA;
        else this.mapping = dataMenuSections;
        this.startPath = 'data';
        break;
      case GlobalRoles.Reporting:
        if (this.translate.currentLang === 'uk-UA') this.mapping = reportingMenuSectionsUA;
        else this.mapping = reportingMenuSections;
        this.startPath = 'reporting';
        break;
    }
  }

  public onSelectItem(url: string): void {
    this.router.navigate([`/${this.startPath}/${url}`]);
  }

  public getFlag(role: string): boolean {
    let urls = this.mapping[role].urls;
    for (let i = 0; i < urls.length; i++) {
      if (this.menuDict[urls[i]] != undefined && !this.menuDict[urls[i]]) {
        return false;
      }
    }

    return true;
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    
    this.shared.removeData();
  }
}
