// import { Message } from "@classes/index";

export interface userSnippet {
  uid: string;
  name: string;
}
export interface chatFromDatabase {
  uids: string[];
  userSnippets: userSnippet[];
  // messages: messageFromDatabase[];
  // batchVolume: number;
  // lastInteracted: firebase.firestore.Timestamp;
}
// export interface chat {
//   id: string;
//   recipient: userSnippet;
//   recentMessage: Message;
// }
