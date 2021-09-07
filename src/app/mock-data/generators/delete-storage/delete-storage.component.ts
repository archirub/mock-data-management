import { Component, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";

@Component({
  selector: "app-delete-storage",
  templateUrl: "./delete-storage.component.html",
  styleUrls: ["./delete-storage.component.scss"],
})
export class DeleteStorageComponent implements OnInit {
  constructor(private afFunctions: AngularFireFunctions) {}

  ngOnInit() {}

  async onDeleteStorage() {
    const response = await this.afFunctions
      .httpsCallable("deleteAllStorage")({})
      .toPromise();
    console.log(response);
  }
}
