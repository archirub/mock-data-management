import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "src/app/services/name.service";

import {
  socialFeatures,
  matchObject,
  searchCriteriaOptions,
  AgeRange,
  AreaOfStudy,
  Interest,
  SearchFeatures,
  SocietyCategory,
  University,
  Location,
} from "../../interfaces/profile.model";

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
    let socialFeatures: socialFeatures[] = [];
    const userIDs = new Array().concat(
      userRefs.docs.map((doc) => {
        socialFeatures.push(doc.data().socialFeatures);
        return doc.id;
      })
    );

    // Creating new match docs
    // & Adding matches from profile document to matchDataDoc's matches array
    const matchDataDocs = userIDs.map((userID, index) => {
      const doc = this.newMatch(userID, socialFeatures[index]);
      const matches = userRefs.docs.filter((doc) => doc.id === userID)[0].data()
        .matches;
      doc.matchObject.bannedUsers = matches;
      doc.matchObject.matches = matches;

      return doc;
    });

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

  private newMatch(userID: string, socialFeatures_: socialFeatures) {
    const PI: number = Math.random();

    //University
    const university: University = searchCriteriaOptions.university[
      Math.floor(Math.random() * searchCriteriaOptions.university.length)
    ] as University;

    const areaOfStudy: AreaOfStudy = searchCriteriaOptions.areaOfStudy[
      Math.floor(Math.random() * searchCriteriaOptions.areaOfStudy.length)
    ] as AreaOfStudy;

    const ageRange: AgeRange = searchCriteriaOptions.ageRange[
      Math.floor(Math.random() * searchCriteriaOptions.ageRange.length)
    ] as AgeRange;

    const societyCategory: SocietyCategory = searchCriteriaOptions
      .societyCategory[
      Math.floor(Math.random() * searchCriteriaOptions.societyCategory.length)
    ] as SocietyCategory;

    const interest: Interest = searchCriteriaOptions.interest[
      Math.floor[Math.random() * searchCriteriaOptions.interest.length]
    ] as Interest;

    const location: Location = searchCriteriaOptions.location[
      Math.floor[Math.random() * searchCriteriaOptions.location.length]
    ] as Location;

    const searchFeatures: SearchFeatures = {
      university,
      areaOfStudy,
      ageRange,
      societyCategory,
      interest,
      location,
    };

    const matchObject: matchObject = {
      PI,
      searchFeatures,
      bannedUsers: [],
      likedUsers: [],
      matches: [],
    };

    return { matchObject, userID };
  }
}
