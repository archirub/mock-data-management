import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { EnvironmentService } from "./environment.service";

@Injectable({
  providedIn: "root",
})
export class PictureUploadService {
  constructor(
    private environment: EnvironmentService,
    private afStorage: AngularFireStorage
  ) {}

  async uploadToFirebase(fileList: FileList, uid: string) {
    return Promise.all(
      Object.keys(fileList).map(async (key, index) => {
        const file = fileList[index];
        const imageType = file.type.replace("image/", "");
        const refString = "profilePictures/" + uid + "/" + index;
        console.log(this.environment.activeDatabase);
        const ref = this.afStorage.ref(refString);

        return ref.put(file);
      })
    );
  }

  async uploadSingleToFirebase(file: File, uid: string, fileIndex) {
    console.log("a", file);
    const imageType = file.type.replace("image/", "");
    const refString = "profilePictures/" + uid + "/" + fileIndex;
    const ref = this.afStorage.ref(refString);
    await ref.put(file);
  }
}
