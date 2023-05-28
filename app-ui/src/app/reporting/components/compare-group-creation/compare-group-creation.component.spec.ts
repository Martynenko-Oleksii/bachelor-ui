import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGroupCreationComponent } from './compare-group-creation.component';

describe('CompareGroupCreationComponent', () => {
  let component: CompareGroupCreationComponent;
  let fixture: ComponentFixture<CompareGroupCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareGroupCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareGroupCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
