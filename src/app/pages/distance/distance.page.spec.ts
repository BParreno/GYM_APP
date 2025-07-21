import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistancePage } from './distance.page';

describe('DistancePage', () => {
  let component: DistancePage;
  let fixture: ComponentFixture<DistancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DistancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
