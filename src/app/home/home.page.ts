import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../environments/environment.prod";

import { databaseService } from "../services/database.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(private databaseService: databaseService) {}

  public onChangeDatabase(event) {
    this.databaseService.changeDatabase();
    console.log(`Database now is: ${this.databaseService.activeDatabase.name}`);
  }
}
