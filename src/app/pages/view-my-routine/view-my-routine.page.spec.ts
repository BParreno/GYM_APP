import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMyRoutinePage } from './view-my-routine.page';

describe('ViewMyRoutinePage', () => {
  let component: ViewMyRoutinePage;
  let fixture: ComponentFixture<ViewMyRoutinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMyRoutinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
