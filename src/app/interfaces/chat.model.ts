// interface userProfileSnipets {
//   [userID: string]: { name: string; picture: string };
// }

// interface chatExtraFields {
//   userIDs: IDmap;
//   lastMessage: string;
// }

// export type chat = userProfileSnipets | chatExtraFields;

export interface userSnippet {
  uid: string;
  name: string;
  picture: string;
}
export interface chat {
  uids: string[];
  userSnippets: userSnippet[];
  messages: message[];
  batchVolume: number;
  lastInteracted: Date;
}

export interface message {
  senderID: string;
  time: Date;
  content: string;
  reaction: messageReaction;
}

export type messageReaction =
  | "null"
  | "love"
  | "angry"
  | "laugh"
  | "cry"
  | "thumbUp"
  | "thumbDown";

export const MessageReaction: messageReaction[] = [
  "null",
  "love",
  "angry",
  "laugh",
  "cry",
  "thumbUp",
  "thumbDown",
];
