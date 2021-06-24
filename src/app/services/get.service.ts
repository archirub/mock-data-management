import { Injectable } from "@angular/core";

import { EnvironmentService } from "./environment.service";
import { NameService } from "./name.service";
import {
  DocumentSnapshot,
  FieldPath,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@angular/fire/firestore";
import { profileFromDatabase } from "../interfaces/profile.model";

type whereObject = [
  string | FieldPath,
  "<" | "<=" | "==" | ">=" | ">" | "array-contains" | "in" | "array-contains-any",
  any
];

@Injectable({
  providedIn: "root",
})
export class GetService {
  public profileCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.profileCollection);

  public chatCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.chatCollection);

  public matchCollection = this.environment.activeDatabase
    .firestore()
    .collection(this.name.matchCollection);

  constructor(private environment: EnvironmentService, private name: NameService) {}

  profile(userID: string): Promise<DocumentSnapshot<profileFromDatabase>> {
    return this.profileCollection.doc(userID).get() as Promise<
      DocumentSnapshot<profileFromDatabase>
    >;
  }

  profiles(
    where?: whereObject[],
    limit?: number
  ): Promise<QuerySnapshot<profileFromDatabase>> {
    let query: Query = this.profileCollection;
    if (where) {
      where.forEach((where) => {
        query = query.where(where[0], where[1], where[2]);
      });
    }
    if (limit) {
      query = query.limit(limit);
    }
    return query.get() as Promise<QuerySnapshot<profileFromDatabase>>;
  }

  chats(where?: whereObject[], limit?: number) {
    let query: Query = this.chatCollection;
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
  //   let query: Query = this.chatCollection;
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
