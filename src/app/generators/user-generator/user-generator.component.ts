import {
  QuestionAndAnswer,
  socialMedia,
  SocialMediaLinks,
} from "./../../interfaces/profile.model";
import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "./../../services/name.service";

import * as faker from "faker";

import {
  profileFromDatabase,
  privateProfileFromDatabase,
  profilePictureUrls,
  questionsOptions,
  Question,
} from "../../interfaces/profile.model";
import {
  searchCriteriaGenOptions,
  socialFeatureGenOptions,
  socialMediaGenOptions,
} from "../../interfaces/generating-options";
import {
  Interest,
  SocietyCategory,
  University,
} from "../../interfaces/search-criteria.model";

@Component({
  selector: "app-user-generator",
  templateUrl: "./user-generator.component.html",
  styleUrls: ["./user-generator.component.scss"],
})
export class UserGeneratorComponent {
  constructor(
    private environment: EnvironmentService,
    private name: NameService
  ) {}

  public async onGenerateUsers(
    amount: number,
    database: any = this.environment.activeDatabase.firestore()
  ): Promise<void> {
    if (!amount) {
      return console.error("You must enter a valid quantity of user profiles");
    }

    // await this.environment.activeDatabase.auth()
    const getUIDs = this.environment.activeDatabase
      .functions("europe-west2")
      .httpsCallable("getUIDs");
    const userIDsQuery = await getUIDs({ amount: amount });
    const userIDs: string[] = userIDsQuery.data;
    console.log(userIDs);

    // Generating profiles
    await Promise.all(
      userIDs.map(async (userID) => {
        await database
          .collection(this.name.profileCollection)
          .doc(userID)
          .set(this.newUser())
          .catch((err) => console.error(err));

        await database
          .collection(this.name.profileCollection)
          .doc(userID)
          .collection("private")
          .doc("private")
          .set(this.newPrivateUser())
          .catch((err) => console.error(err));
      })
    );
    console.log(`${amount} user profiles were added to the database.`);
  }

  private newUser(): profileFromDatabase {
    const displayName: string = faker.name.firstName();
    const dateOfBirth: Date = faker.date.between("1995-01-01", "2002-12-31");

    //Map of pictures
    const numberOfPics = Math.floor(Math.random() * 5 + 1);
    const pictures: profilePictureUrls = []; //Declared the 0 property to help TypeScript
    Array.from({ length: numberOfPics }).map(() => {
      pictures.push(faker.image.animals());
    });

    //Biography
    const biography: string = faker.lorem.sentence(
      Math.floor(Math.random() * 20 + 5)
    );

    //University
    const university: University = searchCriteriaGenOptions.university[
      Math.floor(Math.random() * searchCriteriaGenOptions.university.length)
    ] as University;

    //Course
    const course: string =
      socialFeatureGenOptions.course[
        Math.floor(Math.random() * socialFeatureGenOptions.course.length)
      ];

    //Societies
    //Selecting just one society right now, should be adjusted to something like 1 to 5 different ones
    // const societies: SocietyCategory[] = [
    //   searchCriteriaOptions.societyCategory[
    //     Math.floor(Math.random() * searchCriteriaOptions.societyCategory.length)
    //   ],
    // ] as SocietyCategory[];
    const society: SocietyCategory =
      searchCriteriaGenOptions.societyCategory[
        Math.floor(
          Math.random() * searchCriteriaGenOptions.societyCategory.length
        )
      ];

    const numberOfInterests = Math.floor(Math.random() * 2 + 1);
    const interests: Interest[] = [];
    this.shuffleArray([...Array(numberOfInterests).keys()]).forEach((index) => {
      interests.push(searchCriteriaGenOptions.interest[index]);
    });

    const numberOfQuestions = Math.floor(Math.random() * 2 + 1);
    const Qs: Question[] = [];
    this.shuffleArray([...Array(numberOfQuestions).keys()]).forEach((index) => {
      Qs.push(questionsOptions[index]);
    });
    const questions: QuestionAndAnswer[] = [];
    Qs.forEach((Q) => {
      questions.push({ question: Q, answer: faker.lorem.sentence() });
    });

    const location =
      searchCriteriaGenOptions.location[
        Math.floor(Math.random() * searchCriteriaGenOptions.location.length)
      ];

    const numberOfSocials = Math.floor(
      Math.random() * socialMediaGenOptions.length + 1
    );
    const socials: socialMedia[] = [];
    this.shuffleArray([...Array(numberOfSocials).keys()]).forEach((index) => {
      socials.push(socialMediaGenOptions[index]);
    });
    const socialMediaLinks: SocialMediaLinks = [];
    socials.forEach((social) => {
      socialMediaLinks.push({ socialMedia: social, link: "" });
    });

    // Creating user profile object
    const userProfile: profileFromDatabase = {
      displayName,
      dateOfBirth,
      pictures,
      biography,
      university,
      course,
      society,
      interests,
      questions,
      location,
      socialMediaLinks,
      hasMatchDocument: false,
    };

    return userProfile;
  }

  private newPrivateUser(): privateProfileFromDatabase {
    const firstName: string = faker.name.firstName();
    const lastName: string = faker.name.lastName();

    // TO MODIFY ONCE SETTINGS ARE FIGURED OUT
    const settings = [];

    const privateUserProfile: privateProfileFromDatabase = {
      firstName,
      lastName,
      settings,
    };
    return privateUserProfile;
  }

  private shuffleArray(array: any[]): any[] {
    const initialArray = array;
    for (let i = initialArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialArray[i], initialArray[j]] = [initialArray[j], initialArray[i]];
    }
    return initialArray;
  }
}
