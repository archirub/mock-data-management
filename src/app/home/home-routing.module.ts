import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";

const routes: Routes = [
  {
    path: "mock-data",
    loadChildren: () =>
      import("../mock-data/mock-data.module").then((m) => m.MockDataPageModule),
  },
  {
    path: "user-report",
    loadChildren: () =>
      import("../user-report/user-report.module").then((m) => m.UserReportPageModule),
  },
  {
    path: "bug-report",
    loadChildren: () =>
      import("../bug-report/bug-report.module").then((m) => m.BugReportPageModule),
  },
  {
    path: "",
    component: HomePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
