import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "src/app/services/name.service";

import {
  Gender,
  matchObject,
  SexualPreference,
  swipeMode,
} from "../../interfaces/match-data.model";
import {
  matchDataGenOptions,
  searchCriteriaGenOptions,
} from "../../interfaces/generating-options";
import {
  AgeRange,
  AreaOfStudy,
  Interest,
  SearchFeatures,
  SocietyCategory,
  University,
  Location,
} from "../../interfaces/search-criteria.model";

@Component({
  selector: "app-match-generator",
  templateUrl: "./match-generator.component.html",
  styleUrls: ["./match-generator.component.scss"],
})
export class MatchGeneratorComponent {
  constructor(
    private databaseService: EnvironmentService,
    private name: NameService
  ) {}

  public async onGenerateMatches(amount: number) {
    // Converting string to number as <ion-input> gives a string.
    amount = +amount;

    if (!amount) {
      return console.error(
        "You must enter a valid quantity of match documents."
      );
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

    //extracting user ID & social features from database at once
    let interests: Interest[] = [];
    const userIDs = new Array().concat(
      userRefs.docs.map((doc) => {
        interests = doc.data().interests;
        return doc.id;
      })
    );

    // Creating new match docs
    // & Adding matches from profile document to matchDataDoc's matches array
    const matchDataDocs = userIDs.map((userID, index) =>
      // {
      //   const doc = this.newMatch(userID, interests);
      //   const matches = userRefs.docs.filter((doc) => doc.id === userID)[0].data()
      //     .matches;
      //   doc.matchObject.unmatchableUsers = matches;
      //   doc.matchObject.matches = matches;

      //   return doc;
      // }
      this.newMatch(userID, interests)
    );

    const batch = this.databaseService.activeDatabase.firestore().batch();

    // Pushing match docs to batch object
    matchDataDocs.forEach((match) => {
      const matchRef = this.databaseService.activeDatabase
        .firestore()
        .collection(this.name.matchCollection)
        .doc(match.userID);
      batch.set(matchRef, match.matchObject);
    });

    // Setting hasMatchDocument to true in each user's profile
    userRefs.docs.forEach((doc) => {
      batch.update(doc.ref, { hasMatchDocument: true });
    });

    // Commiting changes
    batch
      .commit()
      .then(() => {
        console.log(
          `${documentsFound} new match documents were added to the database.`
        );
      })
      .catch((err) => console.error(err.message));
  }

  private newMatch(userID: string, interests_: Interest[]) {
    const PI: number = Math.random();

    const gender: Gender =
      matchDataGenOptions.gender[
        Math.floor(Math.random() * matchDataGenOptions.gender.length)
      ];
    const sexualPreference: SexualPreference =
      matchDataGenOptions.sexualPreference[
        Math.floor(Math.random() * matchDataGenOptions.sexualPreference.length)
      ];
    const swipeMode: swipeMode =
      matchDataGenOptions.swipeMode[
        Math.floor(Math.random() * matchDataGenOptions.swipeMode.length)
      ];

    //University
    const university: University = searchCriteriaGenOptions.university[
      Math.floor(Math.random() * searchCriteriaGenOptions.university.length)
    ] as University;

    const areaOfStudy: AreaOfStudy = searchCriteriaGenOptions.areaOfStudy[
      Math.floor(Math.random() * searchCriteriaGenOptions.areaOfStudy.length)
    ] as AreaOfStudy;

    const ageRange: AgeRange = searchCriteriaGenOptions.ageRange[
      Math.floor(Math.random() * searchCriteriaGenOptions.ageRange.length)
    ] as AgeRange;

    const societyCategory: SocietyCategory = searchCriteriaGenOptions
      .societyCategory[
      Math.floor(
        Math.random() * searchCriteriaGenOptions.societyCategory.length
      )
    ] as SocietyCategory;

    const interests: Interest[] = interests_ || [];

    const location: Location = searchCriteriaGenOptions.location[
      Math.floor(Math.random() * searchCriteriaGenOptions.location.length)
    ] as Location;

    const searchFeatures: SearchFeatures = {
      university,
      areaOfStudy,
      ageRange,
      societyCategory,
      interests,
      location,
    };

    const showProfile: Boolean =
      matchDataGenOptions.showProfile[
        Math.floor(Math.random() * matchDataGenOptions.showProfile.length)
      ];

    const matchObject: matchObject = {
      PI,

      unmatchableUsers: [],
      likedUsers: [],
      matches: [],

      gender,
      sexualPreference,
      swipeMode,
      searchFeatures,

      showProfile,
    };

    return { matchObject, userID };
  }
}
