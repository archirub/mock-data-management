export interface profile {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  pictures: userPictures;
  biography: string;
  socialFeatures: socialFeatures;
  matches: IDarray;
  hasMatchDocument: boolean; // Helps in match-generator to find profiles with no match document
}

export interface SCriteria {
  university?: University; // select
  areaOfStudy?: AreaOfStudy; // select
  ageRange?: AgeRange; // slider
  societyCategory?: SocietyCategory; // select
  interest?: Interest; // select
  location?: Location; // radio button
}

export type University = "UCL";
export type AreaOfStudy = string;
export type AgeRange = "1821" | "2225" | "26plus";
export type SocietyCategory = string;
export type Interest = string;
export type Location = "onCampus" | "offCampus";

export const searchCriteriaOptions = {
  university: ["UCL"] as University[],
  areaOfStudy: [
    "politics",
    "natural sciences",
    "economics",
    "education",
  ] as AreaOfStudy[],
  ageRange: ["1821", "2225", "26plus"] as AgeRange[],
  societyCategory: [
    "Debate Society",
    "Basketball Society",
    "Football Society",
    "3D Modelling Society",
    "Anime Society",
  ] as SocietyCategory[],
  interest: [
    "sports guy",
    "herb connoisseur",
    "smart guy",
    "beastaLegend",
  ] as Interest[],
  location: ["onCampus", "offCampus"] as Location[],
};

export type Criterion = keyof SCriteria;
export type SearchFeatures = SCriteria;

export type IDarray = string[];

export interface IDmap {
  [userID: string]: true;
}

// users must have between 1 and 5 pictures
export interface userPictures {
  0: string;
  [propName: number]: string;
}
export interface socialFeatures {
  university: University;
  course: Course;
  societies: SocietyCategory[];
}

export type Course = string;

export const socialFeatureOptions = {
  university: searchCriteriaOptions.university as University[],
  course: [
    "Physics",
    "Mathematics",
    "Politics",
    "Computer Science",
    "Liberal Arts",
    "Arts & Sciences",
  ] as Course[],
  societes: searchCriteriaOptions.societyCategory,
};

export interface matchObject {
  PI: number;
  searchFeatures: SearchFeatures;
  bannedUsers: IDarray;
  likedUsers: IDarray;
  matches: IDarray;
}
export interface profileObject {
  ID: string;
  profileSnapshot: firebase.firestore.QueryDocumentSnapshot<
    firebase.firestore.DocumentData
  >;
}
