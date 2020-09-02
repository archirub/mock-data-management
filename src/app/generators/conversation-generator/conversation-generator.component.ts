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
  messageStatus,
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

  public async onClickGenerate(
    userID: string,
    numberOfConversations: number,
    numberOfMessages: number
  ) {
    numberOfConversations = numberOfConversations ? +numberOfConversations : 10;
    numberOfMessages = numberOfMessages ? +numberOfMessages : 10;
    if (!userID || !numberOfConversations) {
      return console.error("Info incomplete");
    }

    const myID = userID;

    const myProfile = await this.get.profile(myID);
    if (!myProfile.exists) {
      return console.error("The user provided doesn't exist.");
    }
    if (!myProfile.get("hasMatchDocument")) {
      return console.error(
        "The user provided either doesn't exist or has no match document."
      );
    }

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

    const myConversations = await this.get.conversations([
      [`userIDs.${myID}`, "==", true],
    ]);

    const usersInMyConversations_ids: string[] = [];
    for (let myConversation of myConversations.docs) {
      for (let hisProfile of theirProfiles) {
        if (myConversation.data[`userIDs.${hisProfile.id}`] === true) {
          usersInMyConversations_ids.push(hisProfile.id);
        }
      }
    }

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
      usersNotInMyConversations_objectArray
    );

    await this.generateMessages(
      myProfileObject,
      theirProfileObjects,
      numberOfMessages
    );

    const theirIDs = theirProfiles.map((hisProfile) => hisProfile.id);
    await this.updateLastMessage(myID, theirIDs);
  }

  private async generateConversations(
    myProfile: profileObject,
    theirProfiles: profileObject[]
  ): Promise<void> {
    try {
      const batch = this.environment.activeDatabase.firestore().batch();
      let myMatches: null | IDarray = myProfile.profileSnapshot.data().matches;

      const myMatchData_query = await this.get.matchData(
        [["userID", "==", myProfile.ID]],
        1
      );
      if (myMatchData_query.empty) {
        console.error("No matchData document was found.");
      }
      const myMatchData = myMatchData_query.docs[0];

      await Promise.all(
        theirProfiles.map(async (hisProfile) => {
          const conversation = this.newConversation(myProfile, hisProfile);
          const conversationRef = this.get.conversationCollection.doc();
          batch.set(conversationRef, conversation);

          if (myMatches) {
            myMatches.push(hisProfile.ID);
          } else {
            myMatches = [hisProfile.ID];
          }

          batch.update(myProfile.profileSnapshot.ref, { matches: myMatches });
          batch.update(myMatchData.ref, { matches: myMatches });

          let hisMatches: null | IDarray = hisProfile.profileSnapshot.data()
            .matches;
          if (hisMatches) {
            hisMatches.push(myProfile.ID);
          } else {
            hisMatches = [myProfile.ID];
          }

          batch.update(hisProfile.profileSnapshot.ref, { matches: hisMatches });

          const hisMatchData_query = await this.get.matchData(
            [["userID", "==", hisProfile.ID]],
            1
          );
          const hisMatchData = hisMatchData_query.docs[0];

          batch.update(hisMatchData.ref, { matches: hisMatches });
        })
      );

      await batch.commit();

      console.log("Conversation creation complete.");
    } catch (e) {
      throw new Error(`Error during generateConversations: ${e}`);
    }
  }

  private async generateMessages(
    myProfile: profileObject,
    theirProfiles: profileObject[],
    numberOfMessages: number
  ) {
    try {
      const batch = this.environment.activeDatabase.firestore().batch();
      await Promise.all(
        theirProfiles.map(async (hisProfile) => {
          const conversation_query = await this.get.conversations(
            [
              [`userIDs.${myProfile.ID}`, "==", true],
              [`userIDs.${hisProfile.ID}`, "==", true],
            ],
            1
          );

          if (conversation_query.empty) {
            console.error(
              `No conversation document found between ${myProfile.ID} and ${hisProfile.ID}.`
            );
          }
          const conversation = conversation_query.docs[0];

          await Promise.all(
            Array.from({ length: 5 }, async () => {
              const message = this.newMessage(myProfile, hisProfile);
              const messageDocumentRef = this.get.conversationCollection
                .doc(conversation.id)
                .collection(this.name.messageCollection)
                .doc();

              batch.set(messageDocumentRef, message);
            })
          );
        })
      );

      await batch.commit();

      console.log("Message creation complete.");
    } catch (e) {
      throw new Error(`Error during generateMessages: ${e}`);
    }
  }

  private newConversation(
    user1: profileObject,
    user2: profileObject
  ): conversation {
    if (!user1 || !user2) return;

    const user1Name: string = user1.profileSnapshot.data().firstName;
    const user1Picture: string = user1.profileSnapshot.data().pictures[0];
    const user2Name: string = user2.profileSnapshot.data().firstName;
    const user2Picture: string = user2.profileSnapshot.data().pictures[0];
    const lastMessage: string = faker.lorem.sentence();

    const conversationObject: conversation = {
      userIDs: { [user1.ID]: true, [user2.ID]: true },
      [user1.ID]: {
        name: user1Name,
        picture: user1Picture,
      },
      [user2.ID]: {
        name: user2Name,
        picture: user2Picture,
      },
      lastMessage: lastMessage,
    };

    return conversationObject;
  }

  private newMessage(user1: profileObject, user2: profileObject): message {
    if (!user1 || !user2) {
      console.log("Can't create new message.");
      return;
    }

    const senderID = Math.round(Math.random()) === 1 ? user1.ID : user2.ID;
    const time: Date = faker.date.recent(10);
    const content = faker.lorem.sentence();
    const reaction: messageReaction =
      MessageReaction[Math.floor(Math.random() * MessageReaction.length)];
    const status: messageStatus = { sent: true, received: false, seen: false };

    const message: message = {
      senderID,
      time,
      content,
      reaction,
      status,
    };

    return message;
  }

  private async updateLastMessage(myID: string, theirIDs: string[]) {
    try {
      const batch = this.environment.activeDatabase.firestore().batch();
      await Promise.all(
        theirIDs.map(async (hisID) => {
          const conversationQuery = await this.get.conversations([
            [`userIDs.${myID}`, "==", true],
            [`userIDs.${hisID}`, "==", true],
          ]);
          const conversation = conversationQuery.docs[0];

          const lastMessageRef = await this.get.conversationCollection
            .doc(conversation.id)
            .collection(this.name.messageCollection)
            .orderBy("time", "desc")
            .limit(1)
            .get();
          const lastMessage = lastMessageRef.docs[0].data()["content"];

          batch.update(conversation.ref, { lastMessage: lastMessage });
        })
      );
      await batch.commit();
      console.log("Last message successfully updated.");
    } catch (e) {
      throw new Error(`Error during updateLastMessage: ${e}`);
    }
  }
}
