import * as functions from "firebase-functions";
// import * as admin from "firebase-admin"

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    return "Hello from Firebase!";
  });
