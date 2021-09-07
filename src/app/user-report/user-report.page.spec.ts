import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserReportPage } from './user-report.page';

describe('UserReportPage', () => {
  let component: UserReportPage;
  let fixture: ComponentFixture<UserReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
