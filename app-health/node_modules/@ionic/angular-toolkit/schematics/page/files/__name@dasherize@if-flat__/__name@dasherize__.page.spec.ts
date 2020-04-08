import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { <%= classify(name) %>Page } from './<%= dasherize(name) %>.page';

describe('<%= classify(name) %>Page', () => {
  let component: <%= classify(name) %>Page;
  let fixture: ComponentFixture<<%= classify(name) %>Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(<%= classify(name) %>Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
