import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSetupGenderPage } from './profile-setup-gender.page';

describe('ProfileSetupGenderPage', () => {
  let component: ProfileSetupGenderPage;
  let fixture: ComponentFixture<ProfileSetupGenderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSetupGenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
