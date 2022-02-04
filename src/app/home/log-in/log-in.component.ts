import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { filter, map } from "rxjs/operators";
import { EnvironmentService } from "src/app/services/environment.service";
// import * as firebase from "firebase";

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent implements OnInit {
  email: string;
  password: string;

  constructor(private environment: EnvironmentService) {}

  signedInEmail$ = this.environment.user$.pipe(map((u) => u?.email));

  ngOnInit() {}

  async logIn() {
    if (!this.email || !this.password) return;

    await this.environment
      .activeAuth()
      .signInWithEmailAndPassword(this.email, this.password);

    this.email = null;
    this.password = null;
  }

  async logOut() {
    return this.environment.activeAuth().signOut();
  }
}
