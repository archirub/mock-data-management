import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "src/app/services/name.service";

import {
  socialFeatures,
  matchObject,
  societies,
} from "../../interfaces/profile.model";

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
  private coursesList: string[] = [
    "Physics",
    "Mathematics",
    "Politics",
    "Computer Science",
    "Liberal Arts",
    "Arts & Sciences",
  ];

  private societiesList: string[] = [
    "Debate Society",
    "Basketball Society",
    "Football Society",
    "3D Modelling Society",
    "Anime Society",
  ];

  private UniverstiesList: string[] = ["UCL"];

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

  private newMatch(userID_: string, socialFeatures_: socialFeatures) {
    const PI: number = Math.random();
    // const height: string = this.heightList[
    //   Math.floor(Math.random() * this.heightList.length)
    // ];
    // const hairColor: string = this.hairColorList[
    //   Math.floor(Math.random() * this.hairColorList.length)
    // ];
    // const skinTone: string = this.skinToneList[
    //   Math.floor(Math.random() * this.skinToneList.length)
    // ];
    //Societies
    //Selecting just one society right now, should be adjusted to something like 1 to 5 different ones
    const societies: societies = {
      [this.societiesList[
        Math.floor(Math.random() * this.societiesList.length)
      ]]: true,
    };

    //University
    const university: string = this.UniverstiesList[
      Math.floor(Math.random() * this.UniverstiesList.length)
    ];

    //Course
    const course: string = this.coursesList[
      Math.floor(Math.random() * this.coursesList.length)
    ];

    const matchObject: matchObject = {
      // userID: userID_,
      PI: PI,
      // socialFeatures: socialFeatures_,
      // physicalFeatures: {
      //   height: height,
      //   hairColor: hairColor,
      //   skinTone: skinTone,
      // },
      searchFeatures: {
        university: university,
        course: course,
        societies: societies,
      },
      bannedUsers: [],
      likedUsers: [],
      matches: [],
    };

    return { matchObject, userID: userID_ };
  }
}
