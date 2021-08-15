import {
  genderOptions,
  sexualPreferenceOptions,
  swipeModeOptions,
} from "./match-data.model";
import { questionsOptions, socialMediaOptions } from "./profile.model";
import { searchCriteriaOptions } from "./search-criteria.model";

export const searchCriteriaGenOptions = {
  university: searchCriteriaOptions.university,
  areaOfStudy: searchCriteriaOptions.areaOfStudy,
  degree: searchCriteriaOptions.degree,
  societyCategory: searchCriteriaOptions.societyCategory,
  interest: searchCriteriaOptions.interest,
  onCampus: searchCriteriaOptions.onCampus,
};

export const socialFeatureGenOptions = {
  university: searchCriteriaOptions.university,
  areaOfStudy: searchCriteriaOptions.areaOfStudy, // not a pre set (unlike the searchCriteriaOptions), these are just for data generating, course is user inputed (as of now)
  societyCategory: searchCriteriaOptions.societyCategory,
  questions: questionsOptions,
};

// const sexualPrefOptions = getCombinations(["male", "female"]);

export const matchDataGenOptions = {
  gender: genderOptions,
  sexualPreference: sexualPreferenceOptions,
  swipeMode: swipeModeOptions,
  showProfile: [true, true, true, true, true, true, true, true, true, false], // to outweight when profile isn't shown but still have some false to make sure everything works fine
};

export const socialMediaGenOptions = socialMediaOptions;

function getCombinations(array) {
  var result = [];
  var f = function (prefix, array) {
    for (var i = 0; i < array.length; i++) {
      result.push([...prefix, array[i]]);
      f([...prefix, array[i]], array.slice(i + 1));
    }
  };
  f([], array);
  return result;
}
