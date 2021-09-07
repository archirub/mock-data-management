import { Component, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";

@Component({
  selector: "app-delete-users",
  templateUrl: "./delete-users.component.html",
  styleUrls: ["./delete-users.component.scss"],
})
export class DeleteUsersComponent implements OnInit {
  constructor(private afFunctions: AngularFireFunctions) {}

  ngOnInit() {}

  async onDeleteAllUsers() {
    const response = await this.afFunctions
      .httpsCallable("deleteAllUsers")({})
      .toPromise();
    console.log(JSON.parse(response));
  }
}
