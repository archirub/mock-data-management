import { Injectable } from "@angular/core";

import { EnvironmentService } from "./environment.service";
import { NameService } from "./name.service";
import { FieldPath, Query } from "@angular/fire/firestore";

type whereObject = [
  string | FieldPath,
  (
    | "<"
    | "<="
    | "=="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "array-contains-any"
  ),
  any
];

@Injectable({
  providedIn: "root",
})
export class GetService {
  public profileCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.profileCollection);

  public conversationCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.conversationCollection);

  public matchCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.matchCollection);

  constructor(
    private environment: EnvironmentService,
    private name: NameService
  ) {}

  profile(userID: string) {
    return this.profileCollection.doc(userID).get();
  }

  profiles(where?: whereObject[], limit?: number) {
    let query: Query = this.profileCollection;
    if (where) {
      where.forEach((where) => {
        query = query.where(where[0], where[1], where[2]);
      });
    }
    if (limit) {
      query = query.limit(limit);
    }
    return query.get();
  }

  conversations(where?: whereObject[], limit?: number) {
    let query: Query = this.conversationCollection;
    if (where) {
      where.forEach((where) => {
        query = query.where(where[0], where[1], where[2]);
      });
    }
    if (limit) {
      query = query.limit(limit);
    }
    return query.get();
  }

  matchData(where?: whereObject[], limit?: number) {
    let query: Query = this.matchCollection;
    if (where) {
      where.forEach((where) => {
        query = query.where(where[0], where[1], where[2]);
      });
    }
    if (limit) {
      query = query.limit(limit);
    }
    return query.get();
  }

  // messages(where?: whereObject[], limit?: number) {
  //   let query: Query = this.conversationCollection;
  //   if (where) {
  //     where.forEach((where) => {
  //       query = query.where(where[0], where[1], where[2]);
  //     });
  //   }
  //   if (limit) {
  //     query = query.limit(limit);
  //   }
  //   return query.collection("messages").get();
  // }
}
