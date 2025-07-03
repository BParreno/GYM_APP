import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleSelectionPage } from './role-selection.page';

describe('RoleSelectionPage', () => {
  let component: RoleSelectionPage;
  let fixture: ComponentFixture<RoleSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
