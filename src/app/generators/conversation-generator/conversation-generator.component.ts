import { Component } from "@angular/core";

import { EnvironmentService } from "../../services/environment.service";
import { NameService } from "./../../services/name.service";
import { GetService } from "src/app/services/get.service";

import * as faker from "faker";

import {
  conversation,
  message,
  messageReaction,
  MessageReaction,
} from "./../../interfaces/conversation.model";
import { IDarray, profileObject } from "../../interfaces/profile.model";

@Component({
  selector: "app-conversation-generator",
  templateUrl: "./conversation-generator.component.html",
  styleUrls: ["./conversation-generator.component.scss"],
})
export class ConversationGeneratorComponent {
  constructor(
    private environment: EnvironmentService,
    private name: NameService,
    private get: GetService
  ) {}

  /**
   * Generates a given number of messages in a given number of conversations, for a given user.
   * @summary The function firsts fetches a set of random user profiles from the database, one for each conversation.
   * The set is randomly chosen as it is impossible to fetch only users who don't yet have a conversation document with
   * the given user, due to the nature of the database (noSQL/firestore).
   * For the users fetched who already have a conversation document with the given user, that document will just be
   * filled with additional message documents.
   * For those who don't, a conversation document is first created between them and the given user, before being filled
   * with message documents.
   * @param {string} userID - The ID of the user for which conversation documents are generated
   * @param {number} numberOfConversations - The number of conversation documents to generate.
   * @param {number} numberOfMessages - The number of message documents to generate per conversation.
   * @return {Promise<void>}
   */
  public async onClickGenerate(
    userID: string,
    numberOfConversations: number,
    numberOfMessages: number
  ): Promise<void> {
    numberOfConversations = numberOfConversations ? +numberOfConversations : 10;
    numberOfMessages = numberOfMessages ? +numberOfMessages : 10;
    if (!userID) {
      return console.error("Info incomplete");
    }

    const myID = userID;

    // FETCHING TARGET DOC PROFILE
    const myProfile = await this.get.profile(myID);
    if (!myProfile.exists) {
      return console.error("The user provided doesn't exist.");
    }
    if (!myProfile.get("hasMatchDocument")) {
      return console.error(
        "The user provided either doesn't exist or has no match document."
      );
    }

    // FETCHING PROFILES OF FUTURE CONVERSATIONAL USERS
    const theirProfiles_query = await this.get.profiles(
      [["hasMatchDocument", "==", true]],
      numberOfConversations + 1
    );
    const theirProfiles: firebase.firestore.QueryDocumentSnapshot<
      firebase.firestore.DocumentData
    >[] = theirProfiles_query.docs;
    theirProfiles.splice(
      theirProfiles.findIndex((profile) => [profile.id === myID]),
      1
    );

    const realNumberOfConversations: number = theirProfiles.length;

    // FETCHING CONVERSATION DOCUMENTS OF TARGET USER
    const myConversations = await this.get.conversations([
      [`userIDs.${myID}`, "==", true],
    ]);

    // FINDING THE ID OF ALL USERS WHO HAVE A CONVERSATION DOC WITH TARGET
    const usersInMyConversations_ids: string[] = [];
    for (let myConversation of myConversations.docs) {
      for (let hisProfile of theirProfiles) {
        if (myConversation.data()[`userIDs.${hisProfile.id}`] === true) {
          usersInMyConversations_ids.push(hisProfile.id);
        }
      }
    }

    // FINDING ID OF ALL USERS WHO DON'T IN ORDER TO CREATE ONE FOR THEM
    const usersNotInMyConversations_ids: string[] = theirProfiles
      .map((hisProfile) => hisProfile.id)
      .filter(
        (hisProfile_id) => !usersInMyConversations_ids.includes(hisProfile_id)
      );

    console.log(
      `Creating new conversation document for ${usersInMyConversations_ids.length}/${realNumberOfConversations} users...`
    );

    const theirProfileObjects: profileObject[] = [];
    const usersNotInMyConversations_objectArray: profileObject[] = [];
    theirProfiles.forEach((hisProfile) => {
      if (usersNotInMyConversations_ids.includes(hisProfile.id)) {
        usersNotInMyConversations_objectArray.push({
          ID: hisProfile.id,
          profileSnapshot: hisProfile,
        });
      }
      theirProfileObjects.push({
        ID: hisProfile.id,
        profileSnapshot: hisProfile,
      });
    });

    const myProfileObject: profileObject = {
      ID: myID,
      profileSnapshot: myProfile,
    };

    await this.generateConversations(
      myProfileObject,
      usersNotInMyConversations_objectArray,
      numberOfMessages
    );

    // await this.generateMessages(
    //   myProfileObject,
    //   theirProfileObjects,
    //   numberOfMessages
    // );

    // const theirIDs = theirProfiles.map((hisProfile) => hisProfile.id);
    // await this.updateLastMessage(myID, theirIDs);
  }

  /**
   * Generates conversation documents between the singular user and the group of users provided, directly to the database.
   * @param {profileObject} myProfile - Object that contains the user's ID and a snapshot of his profile data.
   * @param {profileObject[]} theirProfiles - Array of objects that each contains the user's ID and a snapshot of his profile data.
   * @return {Promise<void>}
   */
  private async generateConversations(
    myProfile: profileObject,
    theirProfiles: profileObject[],
    messageAmount: number
  ): Promise<void> {
    messageAmount = +messageAmount;
    try {
      const batch = this.environment.activeDatabase.firestore().batch();
      let myMatches: null | IDarray = myProfile.profileSnapshot.data().matches;

      const myMatchData = await this.environment.activeDatabase
        .firestore()
        .collection(this.name.matchCollection)
        .doc(myProfile.ID)
        .get();

      if (!myMatchData.exists) {
        console.error("No matchData document was found.");
      }

      await Promise.all(
        theirProfiles.map(async (hisProfile) => {
          const conversation = this.newConversation(
            myProfile,
            hisProfile,
            messageAmount
          );

          const conversationID: string = this.getConversationID(
            myProfile.ID,
            hisProfile.ID
          );
          const conversationRef = this.get.conversationCollection.doc(
            conversationID
          );
          batch.set(conversationRef, conversation);

          myMatches = this.updateMatches(myMatches, hisProfile.ID);

          batch.update(myProfile.profileSnapshot.ref, { matches: myMatches });

          batch.update(myMatchData.ref, { matches: myMatches });

          let hisMatches: null | IDarray = hisProfile.profileSnapshot.data()
            .matches;

          hisMatches = this.updateMatches(hisMatches, myProfile.ID);

          batch.update(hisProfile.profileSnapshot.ref, { matches: hisMatches });

          const hisMatchData = await this.environment.activeDatabase
            .firestore()
            .collection(this.name.matchCollection)
            .doc(hisProfile.ID)
            .get();

          batch.update(hisMatchData.ref, { matches: hisMatches });
        })
      );

      await batch.commit();

      console.log("Conversation creation complete.");
    } catch (e) {
      throw new Error(`Error during generateConversations: ${e}`);
    }
  }

  /**
   * Generates a given number of message documents between the singular user and the group of users provided, directly to the database.
   * @param {profileObject} myProfile - Object that contains the user's ID and a snapshot of his profile data.
   * @param {profileObject[]} theirProfiles - Array of objects that each contains the user's ID and a snapshot of his profile data.
   * @param {number} numberOfMessages - The number of messages to generate per conversation.
   * @return {Promise<void>}
   */
  // private async generateMessages(
  //   myProfile: profileObject,
  //   theirProfiles: profileObject[],
  //   numberOfMessages: number
  // ): Promise<void> {
  //   try {
  //     const batch = this.environment.activeDatabase.firestore().batch();
  //     await Promise.all(
  //       theirProfiles.map(async (hisProfile) => {
  //         const conversation_query = await this.get.conversations(
  //           [
  //             [`userIDs.${myProfile.ID}`, "==", true],
  //             [`userIDs.${hisProfile.ID}`, "==", true],
  //           ],
  //           1
  //         );

  //         if (conversation_query.empty) {
  //           console.error(
  //             `No conversation document found between ${myProfile.ID} and ${hisProfile.ID}.`
  //           );
  //         }
  //         const conversation = conversation_query.docs[0];

  //         await Promise.all(
  //           Array.from({ length: numberOfMessages }, async () => {
  //             const message = this.newMessage(myProfile, hisProfile);
  //             const messageDocumentRef = this.get.conversationCollection
  //               .doc(conversation.id)
  //               .collection(this.name.messageCollection)
  //               .doc();

  //             batch.set(messageDocumentRef, message);
  //           })
  //         );
  //       })
  //     );

  //     await batch.commit();

  //     console.log("Message creation complete.");
  //   } catch (e) {
  //     throw new Error(`Error during generateMessages: ${e}`);
  //   }
  // }

  /**
   * Creates and returns a new conversation document between the two given users, filled with fake data.
   * @param {profileObject} user1 - Object that contains the user's ID and a snapshot of his profile data.
   * @param {profileObject} user2 - Object that contains the user's ID and a snapshot of his profile data.
   * @return {message} Returns the conversation data as an object
   */
  private newConversation(
    user1: profileObject,
    user2: profileObject,
    messageAmount: number
  ): conversation {
    if (!user1 || !user2) return;
    const messageCount = messageAmount ? +messageAmount : 10;

    const user1Name: string = user1.profileSnapshot.data().firstName;
    const user1Picture: string = user1.profileSnapshot.data().pictures[0];
    const user2Name: string = user2.profileSnapshot.data().firstName;
    const user2Picture: string = user2.profileSnapshot.data().pictures[0];
    let messages: message[] = [];

    Array.from({ length: 10 }).forEach(() => {
      messages.push(this.newMessage(user1, user2));
    });

    const conversationObject: conversation = {
      userSnippets: [
        { uid: user1.ID, name: user1Name, picture: user1Picture },
        { uid: user2.ID, name: user2Name, picture: user2Picture },
      ],
      messages,
      batchVolume: 0,
    };

    return conversationObject;
  }

  /**
   * Creates and returns a new message document between the two given users, filled with fake data.
   * @param {profileObject} user1 - Object that contains the user's ID and a snapshot of his profile data.
   * @param {profileObject} user2 - Object that contains the user's ID and a snapshot of his profile data.
   * @return {message} Returns the message data as an object
   */
  private newMessage(user1: profileObject, user2: profileObject): message {
    if (!user1 || !user2) {
      console.log("Can't create new message.");
      return;
    }

    const senderID = Math.round(Math.random()) === 1 ? user1.ID : user2.ID;
    // SHOULD TIME BE RANDOM OR BE NEW DATE.NOW
    // const time: Date = faker.date.recent(10);
    const time: Date = new Date();
    const content = faker.lorem.sentence();
    const reaction: messageReaction =
      MessageReaction[Math.floor(Math.random() * MessageReaction.length)];

    const message: message = {
      senderID,
      time,
      content,
      reaction,
    };

    return message;
  }

  /**
   * Updates the "lastMessage" field directly in the database of each conversation document
   * that the singular given user (who's ID is myID) has with the other given users (theirIDs).
   * @param {string} myID - The ID of the user (a.k.a name of his/her profile document)
   * @param {string[]} theirIDs - The IDs of users that have a conversation document with the singular user
   * @return {Promise<void>} Returns a promise containing nothing
   */
  // private async updateLastMessage(
  //   myID: string,
  //   theirIDs: string[]
  // ): Promise<void> {
  //   try {
  //     const batch = this.environment.activeDatabase.firestore().batch();
  //     await Promise.all(
  //       theirIDs.map(async (hisID) => {
  //         const conversationQuery = await this.get.conversations([
  //           [`userIDs.${myID}`, "==", true],
  //           [`userIDs.${hisID}`, "==", true],
  //         ]);
  //         const conversation = conversationQuery.docs[0];

  //         const lastMessageRef = await this.get.conversationCollection
  //           .doc(conversation.id)
  //           .collection(this.name.messageCollection)
  //           .orderBy("time", "desc")
  //           .limit(1)
  //           .get();
  //         const lastMessage = lastMessageRef.docs[0].data()["content"];

  //         batch.update(conversation.ref, { lastMessage: lastMessage });
  //       })
  //     );
  //     await batch.commit();
  //     console.log("Last message successfully updated.");
  //   } catch (e) {
  //     throw new Error(`Error during updateLastMessage: ${e}`);
  //   }
  // }

  /**
   * Updates the array of matches by adding the new match to it.
   * The array is left unchanged if the new match ID is already in the array of matches.
   * If the array doesn't exist, the new ID is returned in an array.
   * @param {string[]} matchesArray - An array of IDs of the users whom have matched with one.
   * @param {string} newMatch - The ID of a new match.
   * @return {string[]} The updated array of IDs of one's matches
   */
  private updateMatches(
    matchesArray: string[] | undefined,
    newMatch: string
  ): string[] {
    if (!matchesArray) return [newMatch];
    return [...new Set(...matchesArray, ...newMatch)];
  }

  private getConversationID(uid1: string, uid2: string): string {
    if (uid1 < uid2) {
      return uid1.concat(uid2);
    } else {
      return uid2.concat(uid1);
    }
  }
}
