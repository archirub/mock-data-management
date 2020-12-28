import { SearchFeatures } from "./search-criteria.model";

export interface matchObject {
  // userID: string;
  PI: number;

  unmatchableUsers: string[];
  likedUsers: string[];
  matches: string[];

  gender: Gender;
  sexualPreference: SexualPreference;
  swipeMode: swipeMode;
  searchFeatures: SearchFeatures;

  showProfile: Boolean;
}

export const genderOptions = ["male", "female", "non-binary"] as const;
export type Gender = typeof genderOptions[number];
export type SexualPreference = Gender[];

export const swipeModeOptions = ["friend", "dating", "both"] as const;
export type swipeMode = typeof swipeModeOptions[number];
