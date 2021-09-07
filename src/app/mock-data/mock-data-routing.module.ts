import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MockDataPage } from './mock-data.page';

const routes: Routes = [
  {
    path: '',
    component: MockDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MockDataPageRoutingModule {}
