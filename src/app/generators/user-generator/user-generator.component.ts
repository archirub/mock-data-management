import { databaseService } from "../../services/database.service";
import { Component } from "@angular/core";

import * as faker from "faker";

import { userPictures } from "../../interfaces/userPictures.model";
import { userProfile } from "../../interfaces/userProfile.model";

@Component({
  selector: "app-user-generator",
  templateUrl: "./user-generator.component.html",
  styleUrls: ["./user-generator.component.scss"],
})
export class UserGeneratorComponent {
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

  constructor(private databaseService: databaseService) {}

  private onGenerateUsers(
    amount: number,
    database: any = this.databaseService.activeDatabase.firestore()
  ): void {
    if (!amount) {
      return console.error("You must enter a valid quantity of user profiles");
    }

    // Generating "amount" number of profiles
    Array.from({ length: amount }, () => {
      database
        .collection("users")
        .add(this.newUser())
        .catch((err) => console.log(err));
    });
    console.log(`${amount} user profiles were added to the database.`);
  }

  public newUser(): userProfile {
    //First & last names and date of birth
    const firstName: string = faker.name.firstName();
    const lastName: string = faker.name.lastName();
    const dateOfBirth: Date = faker.date.between("1995-01-01", "2002-12-31");

    //Map of pictures
    const numberOfPics = Math.floor(Math.random() * 5 + 1);
    const picturesObject = { 0: "" }; //Declared the 0 property to help TypeScript
    [...Array(numberOfPics)].map((value, index, array) => {
      picturesObject[index] = faker.image.avatar();
    });
    const pictures: userPictures = picturesObject;

    //Course
    const course: string = this.coursesList[
      Math.floor(Math.random() * this.coursesList.length)
    ];

    //Societies
    //Selecting just one society right now, should be adjusted to something like 1 to 5 different ones
    const societies: string[] = [
      this.societiesList[Math.floor(Math.random() * this.societiesList.length)],
    ];

    //University
    const university: string = this.UniverstiesList[
      Math.floor(Math.random() * this.UniverstiesList.length)
    ];

    //Biography
    const biography: string = faker.random.words(
      Math.floor(Math.random() * 20 + 5)
    );

    // Creating user profile object
    const userProfile: userProfile = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      pictures: pictures,
      course: course,
      societies: societies,
      university: university,
      biography: biography,
    };

    return userProfile;
  }
}
