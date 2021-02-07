import { Component, OnInit } from "@angular/core";

import {
  matchDataGenOptions,
  searchCriteriaGenOptions,
} from "src/app/interfaces/generating-options";
import {
  mdFromDatabase,
  piStorage,
  SwipeMode,
  uidDatingStorage,
  uidFriendStorage,
} from "src/app/interfaces/match-data.model";
import { profileFromDatabase } from "src/app/interfaces/profile.model";
import { EnvironmentService } from "../../services/environment.service";
import { Degree } from "../../interfaces/search-criteria.model";

interface PiMap {
  uid: string;
  swipeMode: SwipeMode;
  currentPI: number;
  degree: any;
  gender: "male" | "female" | "other";
  sexualPreference: readonly ["male"] | readonly ["female"] | readonly ["male", "female"];
}

@Component({
  selector: "app-pi-generator",
  templateUrl: "./pi-generator.component.html",
  styleUrls: ["./pi-generator.component.scss"],
})
export class PiGeneratorComponent implements OnInit {
  constructor(private databaseService: EnvironmentService) {}

  ngOnInit() {}

  public async onGeneratePi() {
    const firestore = this.databaseService.activeDatabase.firestore();
    const UIDS_PER_PI_DOC = 10000;

    const matchDataSnapshot = (await firestore
      .collection("matchData")
      .get()) as firebase.firestore.QuerySnapshot<mdFromDatabase>;
    const uidStorageSnapshot = await firestore.collection("uidStorage").get();
    const piStorageSnapshot = await firestore.collection("piStorage").get();

    const batch = this.databaseService.activeDatabase.firestore().batch();

    // EXTRACTING DEGREE PROP FROM PROFILE DOCS
    const degreeMaps: { [uid: string]: Degree } = {};
    await Promise.all(
      matchDataSnapshot.docs.map(async (doc) => {
        const profileDoc = (await firestore
          .collection("profiles")
          .doc(doc.id)
          .get()) as firebase.firestore.DocumentSnapshot<profileFromDatabase>;
        if (!profileDoc.exists) return;
        degreeMaps[doc.id] = profileDoc.data().degree;
      })
    );

    // CREATING MAPS WITH ALL REQUIRED PROPERTIES FOR PI AND UID STORAGE DOCS
    const piMaps: PiMap[] = matchDataSnapshot.docs
      .map((mdDoc) => {
        if (!mdDoc.exists) return null;
        return {
          uid: mdDoc.id,
          swipeMode:
            matchDataGenOptions.swipeMode[
              Math.floor(Math.random() * matchDataGenOptions.swipeMode.length)
            ],
          currentPI: Math.random(),
          degree: degreeMaps[mdDoc.id],
          gender: mdDoc.data().gender,
          sexualPreference: mdDoc.data().sexualPreference,
        };
      })
      .filter((doc) => doc !== null);

    // NEW PI STORAGE
    const newPiStorageDoc = this.getPiStorageFormat(piMaps);
    batch.set(firestore.collection("piStorage").doc(), newPiStorageDoc);

    // NEW UID STORAGE DOCS
    const { uidDatingDocs, uidFriendDoc } = this.getUidStorageDocuments(piMaps);
    batch.set(firestore.collection("uidFriendStorage").doc(), uidFriendDoc);
    uidDatingDocs.forEach((doc) =>
      batch.set(firestore.collection("uidDatingStorage").doc(), doc)
    );

    // DELETING OLD PI AND UID STORAGE DOCUMENTS
    piStorageSnapshot.forEach((snap) => batch.delete(snap.ref));
    uidStorageSnapshot.forEach((snap) => batch.delete(snap.ref));

    await batch.commit();
    console.log("PI and UID storage docs successfully updated");
  }

  private getPiStorageFormat(piMaps: PiMap[]): piStorage {
    const uids: string[] = piMaps.map((map) => map.uid);

    const doc: piStorage = { uids };

    piMaps.forEach((map) => {
      doc[map.uid] = {
        seenCount: 0,
        likeCount: 0,
        currentPI: map.currentPI,
        gender: map.gender,
        sexualPreference: map.sexualPreference,
        degree: map.degree,
      };
    });

    return doc as piStorage;
  }

  private getUidStorageDocuments(
    piMaps: PiMap[]
  ): { uidDatingDocs: uidDatingStorage[]; uidFriendDoc: uidFriendStorage } {
    let uidDatingDocs: uidDatingStorage[] = [];
    let uidFriendDoc: uidFriendStorage;

    const datingMaps = piMaps.filter((m) => m.swipeMode === "dating");
    const friendMaps = piMaps.filter((m) => m.swipeMode === "friend");

    uidFriendDoc = {
      volume: 0,
      uids: friendMaps.map((m) => m.uid),
    };

    // Here gender is taken from sexualPreference on purpose, as we dont' want "other"
    // included there
    for (const gender of ["male", "female"]) {
      for (const sexualPreference of ["male", "female"]) {
        for (const degree of searchCriteriaGenOptions.degree) {
          uidDatingDocs.push({
            volume: 0,
            uids: [],
            gender,
            sexualPreference,
            degree,
          } as uidDatingStorage);
        }
      }
    }

    datingMaps.forEach((map) => {
      for (const sp of map.sexualPreference) {
        const i = uidDatingDocs.findIndex(
          (doc) =>
            doc.degree === map.degree &&
            doc.sexualPreference === sp &&
            doc.gender === map.gender
        );
        if (i === -1) continue;
        uidDatingDocs[i].uids.push(map.uid);
      }
    });

    return { uidDatingDocs, uidFriendDoc };
  }
}
