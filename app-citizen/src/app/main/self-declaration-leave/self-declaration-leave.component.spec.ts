import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelfDeclarationLeaveComponent } from './self-declaration-leave.component';

describe('SelfDeclarationLeaveComponent', () => {
  let component: SelfDeclarationLeaveComponent;
  let fixture: ComponentFixture<SelfDeclarationLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfDeclarationLeaveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelfDeclarationLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
