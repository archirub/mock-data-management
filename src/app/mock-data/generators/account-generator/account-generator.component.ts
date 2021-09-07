import { Component, OnInit } from "@angular/core";

import { EnvironmentService } from "../../../services/environment.service";

import * as faker from "faker";

@Component({
  selector: "app-account-generator",
  templateUrl: "./account-generator.component.html",
  styleUrls: ["./account-generator.component.scss"],
})
export class AccountGeneratorComponent implements OnInit {
  constructor(private environment: EnvironmentService) {}

  ngOnInit() {}

  async onGenerateAccounts(amount: number) {
    if (!amount) {
      return console.error("You must enter a valid quantity of user profiles");
    }
    try {
      amount = +amount;

      await Promise.all(
        Array.from({ length: amount }).map(async () => {
          await this.newAccount();
        })
      );
      console.log("Accounts successfully generated");
    } catch {
      console.log("An error occured while generating the accounts.");
    }
  }

  private async newAccount(): Promise<void> {
    const email: string = faker.internet.email();
    const password: string = "1234567890";
    await this.environment.activeDatabase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  }
}
