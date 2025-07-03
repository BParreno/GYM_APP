import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSetupWeightPage } from './profile-setup-weight.page';

describe('ProfileSetupWeightPage', () => {
  let component: ProfileSetupWeightPage;
  let fixture: ComponentFixture<ProfileSetupWeightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSetupWeightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
