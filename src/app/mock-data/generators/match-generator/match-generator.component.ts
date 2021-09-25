import { Component } from "@angular/core";

import { EnvironmentService } from "../../../services/environment.service";
import { NameService } from "src/app/services/name.service";

import {
  Gender,
  mdFromDatabase,
  mdDatingPickingFromDatabase,
  mdFriendPickingFromDatabase,
  SexualPreference,
  SwipeMode,
} from "../../../interfaces/match-data.model";
import {
  matchDataGenOptions,
  searchCriteriaGenOptions,
} from "../../../interfaces/generating-options";
import {
  Degree,
  AreaOfStudy,
  Interests,
  SearchFeatures,
  SocietyCategory,
} from "../../../interfaces/search-criteria.model";
import { profileFromDatabase } from "src/app/interfaces/profile.model";
import { UniversityName } from "src/app/interfaces/universities.model";

@Component({
  selector: "app-match-generator",
  templateUrl: "./match-generator.component.html",
  styleUrls: ["./match-generator.component.scss"],
})
export class MatchGeneratorComponent {
  constructor(private databaseService: EnvironmentService, private name: NameService) {}

  public async onGenerateMatches(amount: number) {
    // Converting string to number as <ion-input> gives a string.
    amount = +amount;

    if (!amount) {
      return console.error("You must enter a valid quantity of match documents.");
    }

    const userRefs = await this.databaseService.activeDatabase
      .firestore()
      .collection(this.name.profileCollection)
      .where("hasMatchDocument", "==", false)
      .limit(amount)
      .get();

    const documentsFound: number = userRefs.docs.length;
    if (amount != documentsFound) {
      console.log(
        `Only ${documentsFound} docs found with no corresponding match data (out of the ${amount} requested).`
      );
    }
    const profileDocs =
      userRefs.docs as firebase.firestore.QueryDocumentSnapshot<profileFromDatabase>[];
    //extracting user ID & social features from database at once
    const uidInterestMaps = new Array().concat(
      profileDocs.map((doc) => {
        return {
          uid: doc.id,
          interests: doc.data().interests,
          degree: doc.data().degree,
          areaOfStudy: doc.data().areaOfStudy,
          societyCategory: doc.data().societyCategory,
        };
      })
    );

    // Creating new match docs
    // & Adding matches from profile document to matchDataDoc's matches array
    const matchDataDocs = uidInterestMaps.map((map, index) =>
      this.newMatch(
        map.uid,
        map.interest,
        map.degree,
        map.areaOfStudy,
        map.societyCategory
      )
    );

    const batch = this.databaseService.activeDatabase.firestore().batch();

    // Pushing match docs to batch object
    matchDataDocs.forEach((match) => {
      const matchRef = this.databaseService.activeDatabase
        .firestore()
        .collection(this.name.matchCollection)
        .doc(match.userID);
      const matchDatingRef = this.databaseService.activeDatabase
        .firestore()
        .collection(this.name.matchCollection)
        .doc(match.userID)
        .collection("pickingData")
        .doc("dating");
      const matchFriendRef = this.databaseService.activeDatabase
        .firestore()
        .collection(this.name.matchCollection)
        .doc(match.userID)
        .collection("pickingData")
        .doc("friend");

      batch.set(matchRef, match.mdObject);
      batch.set(matchDatingRef, match.mdDatingObject);
      batch.set(matchFriendRef, match.mdFriendObject);
    });

    // Setting hasMatchDocument to true in each user's profile
    userRefs.docs.forEach((doc) => {
      batch.update(doc.ref, { hasMatchDocument: true });
    });

    // Commiting changes
    batch
      .commit()
      .then(() => {
        console.log(`${documentsFound} new match documents were added to the database.`);
      })
      .catch((err) => console.error(err.message));
  }

  private newMatch(
    userID: string,
    interests: Interests[],
    degree: Degree,
    areaOfStudy: AreaOfStudy,
    societyCategory: SocietyCategory
  ): {
    userID: string;
    mdObject: mdFromDatabase;
    mdDatingObject: mdDatingPickingFromDatabase;
    mdFriendObject: mdFriendPickingFromDatabase;
  } {
    const PI: number = Math.random();

    const gender: Gender =
      matchDataGenOptions.gender[
        Math.floor(Math.random() * matchDataGenOptions.gender.length)
      ];
    const sexualPreference: SexualPreference = matchDataGenOptions.sexualPreference[
      Math.floor(Math.random() * matchDataGenOptions.sexualPreference.length)
    ] as SexualPreference;
    const swipeMode: SwipeMode = "dating";
    // matchDataGenOptions.swipeMode[
    //   Math.floor(Math.random() * matchDataGenOptions.swipeMode.length)
    // ];

    //University
    const university: UniversityName = searchCriteriaGenOptions.university[
      Math.floor(Math.random() * searchCriteriaGenOptions.university.length)
    ] as UniversityName;

    const interest: Interests[] = interests || [];

    // const onCampus: OnCampus =
    //   searchCriteriaGenOptions.onCampus[
    //     Math.floor(Math.random() * searchCriteriaGenOptions.onCampus.length)
    //   ];

    const searchFeatures: SearchFeatures = {
      university,
      areaOfStudy,
      degree,
      societyCategory,
      interests: interests ?? [],
    };

    // matchDataGenOptions.showProfile[
    //   Math.floor(Math.random() * matchDataGenOptions.showProfile.length)
    // ];

    const mdObject: mdFromDatabase = {
      uidCount: 0,
      matchedUsers: {},
      dislikedUsers: {},
      fmatchedUsers: {},
      fdislikedUsers: {},
      reportedUsers: {},
      gender,
      sexualPreference,
      swipeMode,
    };
    const mdDatingObject: mdDatingPickingFromDatabase = {
      uidCount: 0,
      searchFeatures,
      likedUsers: {},
      superLikedUsers: {},
      reportedUsers: {},
    };
    const mdFriendObject: mdFriendPickingFromDatabase = {
      uidCount: 0,
      searchFeatures,
      fLikedUsers: {},
      reportedUsers: {},
    };

    return { userID, mdObject, mdDatingObject, mdFriendObject };
  }
}
