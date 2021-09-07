import { Component, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";

@Component({
  selector: "app-delete-data",
  templateUrl: "./delete-data.component.html",
  styleUrls: ["./delete-data.component.scss"],
})
export class DeleteDataComponent implements OnInit {
  constructor(private afFunctions: AngularFireFunctions) {}

  ngOnInit() {}

  async onDeleteAllData() {
    const response = await this.afFunctions
      .httpsCallable("deleteAllData")({})
      .toPromise();
    console.log(JSON.parse(JSON.stringify(response.info)));
  }
}
