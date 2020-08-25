import { userPictures } from "./userPictures.model";

export interface userProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  pictures: userPictures;
  course: string;
  societies: string[];
  university: string;
  biography: string;
}
