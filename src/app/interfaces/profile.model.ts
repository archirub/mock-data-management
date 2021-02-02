import {
  Interest,
  SocietyCategory,
  University,
  searchCriteriaFromDatabase,
  OnCampus,
  Degree,
} from "./search-criteria.model";
// export interface profile {
//   // uid: string;
//   firstName: string;
//   lastName: string;
//   dateOfBirth: Date;
//   pictures: profilePictureUrls;
//   biography: string;
//   socialFeatures: socialFeatures;
// }

export interface profileFromDatabase {
  displayName: string;
  dateOfBirth: Date;
  pictures: profilePictureUrls;
  biography: string;

  university: University;
  degree: Degree;
  // areaOfStudy: AreaOfStudy;
  course: string;
  society: string; // SOCIETIES???

  // societyCategory: SocietyCategory;
  interests: Interest[];
  questions: QuestionAndAnswer[];
  onCampus: OnCampus;

  socialMediaLinks: SocialMediaLinks;

  hasMatchDocument: boolean; // TEMPORARY Helps in match-generator to find profiles with no match document
}

export interface privateProfileFromDatabase {
  firstName: string;
  lastName: string;
  settings: Setting[];
  latestSearchCriteria: searchCriteriaFromDatabase;
}

// TO DEFINE
const settingNameOption = ["showProfile?"] as const;
export type settingName = typeof settingNameOption[number];
export type Setting = { name: settingName; preference: any };

export const questionsOptions = [
  "Wassup",
  "What's your name",
  "Haha lol?",
  "winziz?",
] as const;
export type Question = typeof questionsOptions[number];
export type QuestionAndAnswer = { question: Question; answer: string };

export const socialMediaOptions = ["facebook", "instagram"] as const;
export type socialMedia = typeof socialMediaOptions[number];
export type SocialMediaLinks = { socialMedia: socialMedia; link: string }[];

export interface socialFeatures {
  university: string;
  course: string;
  societies: SocietyCategory;
}

// users must have between 1 and 5 pictures
export type profilePictureUrls = [string?, string?, string?, string?, string?];

export interface profileObject {
  ID: string;
  profileSnapshot: profileSnapshot;
}

export type profileSnapshot = firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;
