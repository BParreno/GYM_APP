import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateRoutinePage } from './create-routine.page';

describe('CreateRoutinePage', () => {
  let component: CreateRoutinePage;
  let fixture: ComponentFixture<CreateRoutinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoutinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
