import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserReportPageRoutingModule } from './user-report-routing.module';

import { UserReportPage } from './user-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserReportPageRoutingModule
  ],
  declarations: [UserReportPage]
})
export class UserReportPageModule {}
