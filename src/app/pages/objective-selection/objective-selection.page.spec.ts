import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectiveSelectionPage } from './objective-selection.page';

describe('ObjectiveSelectionPage', () => {
  let component: ObjectiveSelectionPage;
  let fixture: ComponentFixture<ObjectiveSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
