import { Component } from "@angular/core";

import { NameService } from "./../../services/name.service";
import { EnvironmentService } from "../../services/environment.service";
import * as faker from "faker";

@Component({
  selector: "app-test-generator",
  templateUrl: "./test-generator.component.html",
  styleUrls: ["./test-generator.component.scss"],
})
export class TestGeneratorComponent {
  constructor(
    private environment: EnvironmentService,
    private name: NameService
  ) {}

  public onClickTest(
    database: any = this.environment.activeDatabase.firestore()
  ): void {
    const data: string = faker.internet.email();
    database
      .collection(this.name.testCollection)
      .add({
        email: data,
      })
      .then(() => console.log("Test worked"))
      .catch((err) => console.error(err));
  }
}
