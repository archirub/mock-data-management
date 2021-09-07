import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BugReportPage } from './bug-report.page';

const routes: Routes = [
  {
    path: '',
    component: BugReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugReportPageRoutingModule {}
