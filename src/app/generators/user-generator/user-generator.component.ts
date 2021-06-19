import {
  QuestionAndAnswer,
  socialMedia,
  SocialMediaLink,
} from "./../../interfaces/profile.model";
import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "./../../services/name.service";

import * as faker from "faker";

import {
  profileFromDatabase,
  privateProfileFromDatabase,
  questionsOptions,
  Question,
  Settings,
} from "../../interfaces/profile.model";
import {
  searchCriteriaGenOptions,
  socialFeatureGenOptions,
  socialMediaGenOptions,
} from "../../interfaces/generating-options";
import {
  Degree,
  Interest,
  OnCampus,
  searchCriteria,
  SocietyCategory,
  University,
} from "../../interfaces/search-criteria.model";
import { PictureUploadService } from "src/app/services/picture-upload.service";
import * as firebase from "firebase";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";

@Component({
  selector: "app-user-generator",
  templateUrl: "./user-generator.component.html",
  styleUrls: ["./user-generator.component.scss"],
})
export class UserGeneratorComponent {
  picturesSelected: FileList;

  constructor(
    private environment: EnvironmentService,
    private name: NameService,
    private pictureUploadService: PictureUploadService,
    private afStorage: AngularFireStorage
  ) {}

  async getProfilePicturesFirebase(uid: string, numberOfPictures: number) {
    uid = "05z5xtqmJYWUgA5OL23ablnxBxv2";
    numberOfPictures = 1;
    const refStrings = Array.from({ length: numberOfPictures }).map(
      (value, index) => "profilePictures/" + uid + "/" + index
    );

    const kaka = await Promise.all(
      refStrings.map(async (refString) => {
        const ref = this.afStorage.ref(refString);
        const url: string = await ref
          .getDownloadURL()
          .toPromise()
          .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            // const xhr = new XMLHttpRequest();
            // xhr.responseType = "blob";
            // xhr.onload = (event) => {
            //   const blob = xhr.response;
            //   console.log("b", blob);
            // };
            // xhr.open("GET", url);
            // xhr.send();
            // console.log(xhr);

            // Or inserted into an <img> element

            return url;
          });

        const blob = await fetch(url).then((res) => res.blob());
        this.blobToBase64(blob).subscribe((a) => {
          console.log("eyo", (a as string).length);
          // const img = document.getElementById("testimage");
          console.log("bruv");
          // img.setAttribute("src", a as string);
        });

        // console.log("asas", fileReader.result);
        // .then((xhr) => console.log(xhr.response));
      })
    );
  }

  private blobToBase64(blob: Blob): Observable<{}> {
    const fileReader = new FileReader();
    const observable = new Observable((observer) => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
    fileReader.readAsDataURL(blob);
    return observable;
  }

  public onSelectPictures(fileList: FileList) {
    if (!fileList) return;
    this.picturesSelected = fileList;
  }

  public async onGenerateUsers(
    amount: number,
    database: any = this.environment.activeDatabase.firestore()
  ): Promise<void> {
    if (!amount) {
      return console.error("You must enter a valid quantity of user profiles");
    }

    if (!this.picturesSelected) {
      return console.error("Select pictures first");
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
      userIDs.map(async (uid) => {
        return Promise.all([
          this.pictureUploadService.uploadToFirebase(this.picturesSelected, uid),

          database
            .collection(this.name.profileCollection)
            .doc(uid)
            .set(this.newUser())
            .catch((err) => console.error(err)),

          database
            .collection(this.name.profileCollection)
            .doc(uid)
            .collection("private")
            .doc("private")
            .set(this.newPrivateUser())
            .catch((err) => console.error(err)),
        ]);
      })
    );
    console.log(`${amount} user profiles were added to the database.`);
  }

  private newUser(): profileFromDatabase {
    const firstName: string = faker.name.firstName();
    const dateOfBirth = firebase.firestore.Timestamp.fromDate(
      faker.date.between("1995-01-01", "2002-12-31")
    );

    //Map of pictures
    // const numberOfPics = Math.floor(Math.random() * 5 + 1);
    // const pictures: profilePictureUrls = []; //Declared the 0 property to help TypeScript
    // Array.from({ length: numberOfPics }).map(() => {
    //   pictures.push(faker.image.animals());
    // });

    //Biography
    const biography: string = faker.lorem.sentence(Math.floor(Math.random() * 20 + 5));

    //University
    const university: University = searchCriteriaGenOptions.university[
      Math.floor(Math.random() * searchCriteriaGenOptions.university.length)
    ] as University;

    const degree: Degree =
      searchCriteriaGenOptions.degree[
        Math.floor(Math.random() * searchCriteriaGenOptions.degree.length)
      ];

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
        Math.floor(Math.random() * searchCriteriaGenOptions.societyCategory.length)
      ];

    const numberOfInterest = Math.floor(Math.random() * 2 + 1);
    const interests: Interest[] = [];
    this.shuffleArray([...Array(numberOfInterest).keys()]).forEach((index) => {
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

    const onCampus: OnCampus =
      searchCriteriaGenOptions.onCampus[
        Math.floor(Math.random() * searchCriteriaGenOptions.onCampus.length)
      ];

    const numberOfSocials = Math.floor(Math.random() * socialMediaGenOptions.length + 1);
    const socials: socialMedia[] = [];
    this.shuffleArray([...Array(numberOfSocials).keys()]).forEach((index) => {
      socials.push(socialMediaGenOptions[index]);
    });
    const socialMediaLinks: SocialMediaLink[] = [];
    socials.forEach((social) => {
      socialMediaLinks.push({ socialMedia: social, link: "" });
    });

    // Creating user profile object
    const userProfile: profileFromDatabase = {
      firstName,
      dateOfBirth,
      picturesCount: this.picturesSelected.length,
      biography,
      university,
      degree,
      course,
      society,
      interests,
      questions,
      onCampus,
      socialMediaLinks,
      hasMatchDocument: false,
    };

    return userProfile;
  }

  private newPrivateUser(): privateProfileFromDatabase {
    // TO MODIFY ONCE SETTINGS ARE FIGURED OUT
    const settings: Settings = { showProfile: true };
    const latestSearchCriteria: searchCriteria = {
      university: null,
      areaOfStudy: null,
      degree: null,
      societyCategory: null,
      interest: null,
      onCampus: null,
    };

    const privateUserProfile: privateProfileFromDatabase = {
      latestSearchCriteria,
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
