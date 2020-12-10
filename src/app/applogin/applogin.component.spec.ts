import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApploginComponent } from './applogin.component';

describe('ApploginComponent', () => {
  let component: ApploginComponent;
  let fixture: ComponentFixture<ApploginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApploginComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApploginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
