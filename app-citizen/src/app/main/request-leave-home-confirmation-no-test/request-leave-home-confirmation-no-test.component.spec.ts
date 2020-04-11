import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestLeaveHomeConfirmationNoTestComponent } from './request-leave-home-confirmation-no-test.component';

describe('RequestLeaveHomeConfirmationNoTestComponent', () => {
  let component: RequestLeaveHomeConfirmationNoTestComponent;
  let fixture: ComponentFixture<RequestLeaveHomeConfirmationNoTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestLeaveHomeConfirmationNoTestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestLeaveHomeConfirmationNoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
