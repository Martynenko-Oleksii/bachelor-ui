import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingPeriodsComponent } from './reporting-periods.component';

describe('ReportingPeriodsComponent', () => {
  let component: ReportingPeriodsComponent;
  let fixture: ComponentFixture<ReportingPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingPeriodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportingPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
