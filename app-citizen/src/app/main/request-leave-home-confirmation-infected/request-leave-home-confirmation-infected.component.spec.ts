import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestLeaveHomeConfirmationInfectedComponent } from './request-leave-home-confirmation-infected.component';

describe('RequestLeaveHomeConfirmationInfectedComponent', () => {
  let component: RequestLeaveHomeConfirmationInfectedComponent;
  let fixture: ComponentFixture<RequestLeaveHomeConfirmationInfectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestLeaveHomeConfirmationInfectedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestLeaveHomeConfirmationInfectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
