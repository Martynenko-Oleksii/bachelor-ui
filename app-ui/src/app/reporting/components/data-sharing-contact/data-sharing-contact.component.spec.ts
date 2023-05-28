import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSharingContactComponent } from './data-sharing-contact.component';

describe('DataSharingContactComponent', () => {
  let component: DataSharingContactComponent;
  let fixture: ComponentFixture<DataSharingContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSharingContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSharingContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
