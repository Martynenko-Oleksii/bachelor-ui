import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGroupsComponent } from './compare-groups.component';

describe('CompareGroupsComponent', () => {
  let component: CompareGroupsComponent;
  let fixture: ComponentFixture<CompareGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
