import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { UserReport } from "../interfaces/user-report.models";

@Component({
  selector: "app-user-report",
  templateUrl: "./user-report.page.html",
  styleUrls: ["./user-report.page.scss"],
})
export class UserReportPage implements OnInit {
  userReports: {
    id: string;
    report: UserReport;
    ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  }[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.fetchReports();
  }

  async fetchReports() {
    const query = await this.firestore.firestore.collection("userReports").get();
    this.userReports = query.docs
      .map((doc) =>
        doc.exists ? { id: doc.id, report: doc.data() as UserReport, ref: doc.ref } : null
      )
      .filter(Boolean);
  }
}
