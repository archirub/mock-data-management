import { Gender, genderOptions, swipeModeOptions } from "./match-data.model";
import { questionsOptions, socialMediaOptions } from "./profile.model";
import { searchCriteriaOptions } from "./search-criteria.model";

export const searchCriteriaGenOptions = {
  university: searchCriteriaOptions.university,
  areaOfStudy: searchCriteriaOptions.areaOfStudy,
  ageRange: searchCriteriaOptions.ageRange,
  societyCategory: searchCriteriaOptions.societyCategory,
  interest: searchCriteriaOptions.interest,
  location: searchCriteriaOptions.location,
};

export const socialFeatureGenOptions = {
  university: searchCriteriaOptions.university,
  course: [
    "Physics",
    "Mathematics",
    "Politics",
    "Computer Science",
    "Liberal Arts",
    "Arts & Sciences",
  ], // not a pre set (unlike the searchCriteriaOptions), these are just for data generating, course is user inputed (as of now)
  societes: searchCriteriaOptions.societyCategory,
  questions: questionsOptions,
};

const sexualPrefOptions: Gender[][] = getCombinations(genderOptions);

export const matchDataGenOptions = {
  gender: genderOptions,
  sexualPreference: sexualPrefOptions,
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
