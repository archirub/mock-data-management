import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BugReportPageRoutingModule } from './bug-report-routing.module';

import { BugReportPage } from './bug-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BugReportPageRoutingModule
  ],
  declarations: [BugReportPage]
})
export class BugReportPageModule {}
