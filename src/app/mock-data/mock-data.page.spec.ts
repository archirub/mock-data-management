import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MockDataPage } from './mock-data.page';

describe('MockDataPage', () => {
  let component: MockDataPage;
  let fixture: ComponentFixture<MockDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MockDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
