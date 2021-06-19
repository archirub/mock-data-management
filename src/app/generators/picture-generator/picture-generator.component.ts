import { Component, OnInit } from "@angular/core";
import { AngularFirestore, QueryDocumentSnapshot } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { profileFromDatabase } from "src/app/interfaces/profile.model";
import { PictureUploadService } from "src/app/services/picture-upload.service";

@Component({
  selector: "app-picture-generator",
  templateUrl: "./picture-generator.component.html",
  styleUrls: ["./picture-generator.component.scss"],
})
export class PictureGeneratorComponent implements OnInit {
  picturesSelected: FileList;

  constructor(
    private pictureUploadService: PictureUploadService,
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {}

  public onSelectPictures(fileList: FileList) {
    this.picturesSelected = fileList;
  }

  public onClickGenerate(uid: string) {
    if (!this.picturesSelected || !uid)
      console.error("You must both input a uid and select at least one picture");
    this.pictureUploadService
      .uploadToFirebase(this.picturesSelected, uid)
      .then(() => console.log("Pictures successfully uploaded"));
  }

  public async onClickGenerateForAll() {
    const picturesSelectedCount = this.picturesSelected.length;

    const allProfileDocs = (await this.firestore.collection("profiles").get().toPromise())
      .docs as QueryDocumentSnapshot<profileFromDatabase>[];

    await Promise.all(
      allProfileDocs.map(async (doc) => {
        const profileData = doc.data();
        console.log(profileData);
        await Promise.all(
          Array.from({ length: profileData.pictureCount }).map(async (v, i) => {
            console.log("broici");
            const pictureSelected =
              this.picturesSelected[
                Math.floor(Math.random() * this.picturesSelected.length)
              ];
            await this.pictureUploadService.uploadSingleToFirebase(
              pictureSelected,
              doc.id,
              i
            );
          })
        );
      })
    );
    console.log("Successful shit happened");
  }
}
