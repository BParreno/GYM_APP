import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectiveSelectionIntermedioPage } from './objective-selection-intermedio.page';

describe('ObjectiveSelectionIntermedioPage', () => {
  let component: ObjectiveSelectionIntermedioPage;
  let fixture: ComponentFixture<ObjectiveSelectionIntermedioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveSelectionIntermedioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
