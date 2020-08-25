import { Component } from "@angular/core";

import { databaseService } from "./../../services/database.service";

import {
  socialFeatures,
  physicalFeatures,
  matchObject,
} from "./../../interfaces/user.model";

@Component({
  selector: "app-match-generator",
  templateUrl: "./match-generator.component.html",
  styleUrls: ["./match-generator.component.scss"],
})
export class MatchGeneratorComponent {
  private skinToneList: string[] = [
    "light",
    "medium-light",
    "medium",
    "medium-dark",
    "dark",
  ];
  private heightList: string[] = ["short", "average", "tall"];
  private hairColorList: string[] = ["blonde", "brown", "red", "black"];

  constructor(private databaseService: databaseService) {}

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
      .collection(this.databaseService.userCollectionName)
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
      userRefs.docs.map((ref) => {
        socialFeatures.push(ref.data().socialFeatures);
        return ref.id;
      })
    );

    // Creating new match docs
    const matches = userIDs.map((userID, index) => {
      return this.newMatch(userID, socialFeatures[index]);
    });

    const batch = this.databaseService.activeDatabase.firestore().batch();

    // Pushing match docs to batch object
    matches.forEach((match, index) => {
      const matchRef = this.databaseService.activeDatabase
        .firestore()
        .collection(this.databaseService.matchCollectionName)
        .doc();
      batch.set(matchRef, match);
    });

    // Setting hasMatchDocument to true in each user's profile
    userRefs.docs.forEach((doc) => {
      batch.update(doc.ref, { hasMatchDocument: true });
    });

    // Commiting changes
    batch
      .commit()
      .then((e) => {
        console.log(
          `${documentsFound} new match documents were added to the database.`
        );
      })
      .catch((err) => console.error(err));
  }

  private newMatch(userID_: string, socialFeatures_: socialFeatures) {
    const PI: number = Math.random();
    const height: string = this.heightList[
      Math.floor(Math.random() * this.heightList.length)
    ];
    const hairColor: string = this.hairColorList[
      Math.floor(Math.random() * this.hairColorList.length)
    ];
    const skinTone: string = this.skinToneList[
      Math.floor(Math.random() * this.skinToneList.length)
    ];

    const matchObject: matchObject = {
      userID: userID_,
      PI: PI,
      socialFeatures: socialFeatures_,
      physicalFeatures: {
        height: height,
        hairColor: hairColor,
        skinTone: skinTone,
      },
    };

    return matchObject;
  }
}
