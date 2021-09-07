import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BugReportPage } from './bug-report.page';

describe('BugReportPage', () => {
  let component: BugReportPage;
  let fixture: ComponentFixture<BugReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BugReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
