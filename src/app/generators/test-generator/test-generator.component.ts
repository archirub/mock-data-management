import { Component } from "@angular/core";

import { databaseService } from "../../services/database.service";
import * as faker from "faker";

@Component({
  selector: "app-test-generator",
  templateUrl: "./test-generator.component.html",
  styleUrls: ["./test-generator.component.scss"],
})
export class TestGeneratorComponent {
  constructor(private databaseService: databaseService) {}

  public onClickTest(
    database: any = this.databaseService.activeDatabase.firestore()
  ): void {
    const data: string = faker.internet.email();
    database
      .collection(this.databaseService.testCollectionName)
      .add({
        email: data,
      })
      .then(() => console.log("Test worked"))
      .catch((err) => console.error(err));
  }
}
