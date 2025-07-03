import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRoutinePage } from './select-routine.page';

describe('SelectRoutinePage', () => {
  let component: SelectRoutinePage;
  let fixture: ComponentFixture<SelectRoutinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRoutinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
