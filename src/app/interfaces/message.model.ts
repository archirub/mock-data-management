export interface messageFromDatabase {
  senderID: string;
  time: firebase.firestore.Timestamp;
  content: string;
  reaction: messageReaction;
  seen: Boolean;
}

export interface message {
  senderID: string;
  time: Date;
  content: string;
  reaction: messageReaction;
  state: messageState;
  seen: Boolean;
}

export const messageReactionOptions = [
  "null",
  "love",
  "angry",
  "laugh",
  "cry",
  "thumbUp",
  "thumbDown",
] as const;
export type messageReaction = typeof messageReactionOptions[number];

export const messageStateOptions = ["sent", "sending", "failed"] as const;
export type messageState = typeof messageStateOptions[number];