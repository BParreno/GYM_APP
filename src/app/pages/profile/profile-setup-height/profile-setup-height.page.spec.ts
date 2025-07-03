import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSetupHeightPage } from './profile-setup-height.page';

describe('ProfileSetupHeightPage', () => {
  let component: ProfileSetupHeightPage;
  let fixture: ComponentFixture<ProfileSetupHeightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSetupHeightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
