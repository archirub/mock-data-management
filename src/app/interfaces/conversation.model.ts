import { IDmap } from "./profile.model";

interface userProfileSnipets {
  [userID: string]: { name: string; picture: string };
}

interface conversationExtraFields {
  userIDs: IDmap;
  lastMessage: string;
}

export type conversation = userProfileSnipets | conversationExtraFields;

export interface message {
  senderID: string;
  time: Date;
  content: string;
  reaction: messageReaction;
  status: messageStatus;
}

export type messageReaction =
  | "love"
  | "angry"
  | "laugh"
  | "cry"
  | "thumbUp"
  | "thumbDown";

export const MessageReaction: messageReaction[] = [
  "love",
  "angry",
  "laugh",
  "cry",
  "thumbUp",
  "thumbDown",
];

export interface messageStatus {
  sent: Boolean;
  received: Boolean;
  seen: Boolean;
}
