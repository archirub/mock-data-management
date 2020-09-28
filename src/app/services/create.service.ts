import { Injectable } from "@angular/core";

import { NameService } from "./name.service";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: "root",
})
export class CreateService {
  public profileCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.profileCollection);

  public chatCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.chatCollection);

  public matchCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.matchCollection);

  constructor(
    private environment: EnvironmentService,
    private name: NameService
  ) {}
}
