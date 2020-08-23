import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as faker from "faker";
import { range } from "rxjs";

// users must have between 1 and 5 pictures
interface userPictures {
  0: string;
  [propName: number]: string;
}

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  public usersToGenerate: number;

  private coursesList = [
    "Physics",
    "Mathematics",
    "Politics",
    "Computer Science",
    "Liberal Arts",
    "Arts & Sciences",
  ];

  private societiesList = [
    "Debate Society",
    "Basketball Society",
    "Football Society",
    "3D Modelling Society",
    "Anime Society",
  ];

  private UniverstiesList = ["UCL"];

  constructor(private database: AngularFirestore) {}

  public onClickTest(): void {
    const data: string = faker.internet.email();
    this.database
      .collection("test")
      .add({
        email: data,
      })
      .then((e) => console.log(e));
  }

  public onGenerateUsers(amount: number = this.usersToGenerate): void {
    if (!amount) return;

    Array.from({ length: amount }, () => {
      const firstName: string = faker.name.firstName();
      const lastName: string = faker.name.lastName();
      const dateOfBirth: Date = faker.date.between("1995-01-01", "2002-12-31");

      let pictures: userPictures;
      const numberOfPics = Math.floor(Math.random() * 5 + 1);
      const picturesObject = { 0: "" }; //Declared the 0 property to help TypeScript
      [...Array(numberOfPics)].map((value, index, array) => {
        picturesObject[index] = faker.image.avatar();
      });
      pictures = picturesObject;

      const course: string = this.coursesList[
        Math.floor(Math.random() * this.coursesList.length)
      ];
      const societies: string[] = [
        this.societiesList[
          Math.floor(Math.random() * this.societiesList.length)
        ],
      ];
      const university: string = this.UniverstiesList[
        Math.floor(Math.random() * this.UniverstiesList.length)
      ];
      const biography: string = faker.random.words(
        Math.floor(Math.random() * 50 + 5)
      );

      const userProfile = {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        pictures: pictures,
        course: course,
        societies: societies,
        university: university,
        biography: biography,
      };

      this.database.collection("users").add(userProfile);
      console.log("New user: ", userProfile);
    });
  }
}
