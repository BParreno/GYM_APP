import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivacyPolicyModalComponent } from './privacy-policy-modal.component';

describe('PrivacyPolicyModalComponent', () => {
  let component: PrivacyPolicyModalComponent;
  let fixture: ComponentFixture<PrivacyPolicyModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PrivacyPolicyModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
