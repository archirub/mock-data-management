import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserReportPage } from './user-report.page';

const routes: Routes = [
  {
    path: '',
    component: UserReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserReportPageRoutingModule {}
