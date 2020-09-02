import { Injectable } from "@angular/core";

import { firebaseEnvironment } from "../interfaces/environment.model";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root",
})
export class EnvironmentService {
  private productionEnvironment: firebaseEnvironment = {
    apiKey: "AIzaSyD7TzqM68bZ1FvVyB5PhZSJpT-CdsCvHdE",
    authDomain: "nemo-2c57c.firebaseapp.com",
    databaseURL: "https://nemo-2c57c.firebaseio.com",
    projectId: "nemo-2c57c",
    storageBucket: "nemo-2c57c.appspot.com",
    messagingSenderId: "1071740442557",
    appId: "1:1071740442557:web:715814796e8fddbb6be4d4",
    measurementId: "G-59EJ9YP2XV",
  };
  private developmentEnvironment: firebaseEnvironment = {
    apiKey: "AIzaSyD4rixaoqq7rCxfzp5Hv9o5ZgoeCN7gAoA",
    authDomain: "nemo-dev-1b0bc.firebaseapp.com",
    databaseURL: "https://nemo-dev-1b0bc.firebaseio.com",
    projectId: "nemo-dev-1b0bc",
    storageBucket: "nemo-dev-1b0bc.appspot.com",
    messagingSenderId: "583834078920",
    appId: "1:583834078920:web:841fc727407a261d2c5ffd",
    measurementId: "G-RPK6H2GNK8",
  };
  private prodDatabase: firebase.app.App;
  private devDatabase: firebase.app.App;

  public activeDatabase: firebase.app.App;

  constructor() {
    firebase.initializeApp(this.productionEnvironment, "production");
    firebase.initializeApp(this.developmentEnvironment, "development");
    this.prodDatabase = firebase.app("production");
    this.devDatabase = firebase.app("development");
    this.activeDatabase = this.devDatabase;
  }

  changeDatabase() {
    if (this.activeDatabase.name === "development") {
      this.activeDatabase = this.prodDatabase;
    } else if (this.activeDatabase.name === "production") {
      this.activeDatabase = this.devDatabase;
    } else {
      this.activeDatabase = this.devDatabase;
      console.error(
        'Unrecognized environment type. EnvironmentType osbervable was set to "development".'
      );
    }
  }
}
