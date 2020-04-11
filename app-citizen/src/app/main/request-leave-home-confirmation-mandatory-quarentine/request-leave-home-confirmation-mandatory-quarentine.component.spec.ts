import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestLeaveHomeConfirmationMandatoryQuarentineComponent } from './request-leave-home-confirmation-mandatory-quarentine.component';

describe('RequestLeaveHomeConfirmationMandatoryQuarentineComponent', () => {
  let component: RequestLeaveHomeConfirmationMandatoryQuarentineComponent;
  let fixture: ComponentFixture<RequestLeaveHomeConfirmationMandatoryQuarentineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestLeaveHomeConfirmationMandatoryQuarentineComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestLeaveHomeConfirmationMandatoryQuarentineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
