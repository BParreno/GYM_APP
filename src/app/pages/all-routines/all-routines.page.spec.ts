import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllRoutinesPage } from './all-routines.page';

describe('AllRoutinesPage', () => {
  let component: AllRoutinesPage;
  let fixture: ComponentFixture<AllRoutinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRoutinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
