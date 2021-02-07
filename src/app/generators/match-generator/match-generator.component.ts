import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "src/app/services/name.service";

import {
  Gender,
  mdFromDatabase,
  mdDatingPickingFromDatabase,
  mdFriendPickingFromDatabase,
  SexualPreference,
  SwipeMode,
} from "../../interfaces/match-data.model";
import {
  matchDataGenOptions,
  searchCriteriaGenOptions,
} from "../../interfaces/generating-options";
import {
  Degree,
  AreaOfStudy,
  Interest,
  SearchFeatures,
  SocietyCategory,
  University,
  OnCampus,
} from "../../interfaces/search-criteria.model";
import { profileFromDatabase } from "src/app/interfaces/profile.model";

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
    const profileDocs = userRefs.docs as firebase.firestore.QueryDocumentSnapshot<profileFromDatabase>[];
    //extracting user ID & social features from database at once
    // let interests: Interest[] = [];
    const uidInterestMaps = new Array().concat(
      profileDocs.map((doc) => {
        // interests = doc.data().interests;
        return {
          uid: doc.id,
          interest: doc.data().interest,
          degree: doc.data().degree,
        };
      })
    );

    // Creating new match docs
    // & Adding matches from profile document to matchDataDoc's matches array
    const matchDataDocs = uidInterestMaps.map((map, index) =>
      this.newMatch(map.uid, map.interest, map.degree)
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
    interest_: Interest[],
    degree: Degree
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
    const university: University = searchCriteriaGenOptions.university[
      Math.floor(Math.random() * searchCriteriaGenOptions.university.length)
    ] as University;

    const areaOfStudy: AreaOfStudy = searchCriteriaGenOptions.areaOfStudy[
      Math.floor(Math.random() * searchCriteriaGenOptions.areaOfStudy.length)
    ] as AreaOfStudy;

    const societyCategory: SocietyCategory = searchCriteriaGenOptions.societyCategory[
      Math.floor(Math.random() * searchCriteriaGenOptions.societyCategory.length)
    ] as SocietyCategory;

    const interest: Interest[] = interest_ || [];

    const onCampus: OnCampus =
      searchCriteriaGenOptions.onCampus[
        Math.floor(Math.random() * searchCriteriaGenOptions.onCampus.length)
      ];

    const searchFeatures: SearchFeatures = {
      university,
      areaOfStudy,
      degree,
      societyCategory,
      interest,
      onCampus,
    };

    const percentile: number = Math.random();
    const showProfile: Boolean = true;
    // matchDataGenOptions.showProfile[
    //   Math.floor(Math.random() * matchDataGenOptions.showProfile.length)
    // ];

    const mdObject: mdFromDatabase = {
      matchedUsers: {},
      dislikedUsers: {},
      fmatchedUsers: {},
      fdislikedUsers: {},
      reportedUsers: {},
      gender,
      sexualPreference,
      showProfile,
      percentile,
      swipeMode,
    };
    const mdDatingObject: mdDatingPickingFromDatabase = {
      searchFeatures,
      likedUsers: {},
      superLikedUsers: {},
      reportedUsers: {},
    };
    const mdFriendObject: mdFriendPickingFromDatabase = {
      searchFeatures,
      fLikedUsers: {},
      reportedUsers: {},
    };

    // const matchObject: matchDataFromDatabase = {
    //   PI,

    //   matchedUsers: [],
    //   likedUsers: [],
    //   dislikedUsers: [],
    //   superLikedUsers: [],
    //   reportedUsers: [],

    //   gender,
    //   sexualPreference,
    //   swipeMode,
    //   searchFeatures,

    //   showProfile,
    // };

    return { userID, mdObject, mdDatingObject, mdFriendObject };
  }
}
