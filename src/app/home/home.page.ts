import { Component } from "@angular/core";

import { EnvironmentService } from "../services/environment.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(private environment: EnvironmentService) {}

  public onChangeDatabase(event) {
    this.environment.changeDatabase();
    console.log(`Database now is: ${this.environment.activeDatabase.name}`);
  }
}
