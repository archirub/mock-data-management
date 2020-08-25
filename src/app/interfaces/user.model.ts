export interface userProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  pictures: userPictures;
  biography: string;
  socialFeatures: socialFeatures;

  // Helps in match-generator to find which profiles don't yet have
  // a corresponding match document
  hasMatchDocument: boolean;
}

export interface socialFeatures {
  university: string;
  course: string;
  societies: string[];
}

export interface physicalFeatures {
  height: string;
  hairColor: string;
  skinTone: string;
}

// users must have between 1 and 5 pictures
export interface userPictures {
  0: string;
  [propName: number]: string;
}

export interface matchObject {
  userID: string;
  PI: number;
  socialFeatures: socialFeatures;
  physicalFeatures: physicalFeatures;
  bannedUsers?: string[];
  likedUsers?: string[];
}
