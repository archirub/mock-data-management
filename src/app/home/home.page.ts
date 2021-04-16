import { Component } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";

import { Plugins, CameraPhoto, PhotosFetchOptions, PhotosResult } from "@capacitor/core";
const { CameraResultType, CameraSource, Capacitor, Photos } = Plugins;

import { EnvironmentService } from "../services/environment.service";
import * as faker from "faker";
import { PictureUploadService } from "../services/picture-upload.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(
    private environment: EnvironmentService,
    private afStorage: AngularFireStorage,
    private pictureUpload: PictureUploadService
  ) {}

  public onChangeDatabase(event) {
    this.environment.changeDatabase();
    console.log(`Database now is: ${this.environment.activeDatabase.name}`);
  }

  async handlePictureInput(event: FileList) {
    const uid = "123abc";
    await this.pictureUpload.uploadToFirebase(event, uid);
    console.log(event);
  }

  public async sendPic() {
    console.log("EYO");
    const pic = faker.image.animals();
    // const fa = await fetch(pic, {
    //   mode: "no-cors",
    // });
    // const blob = await fa.blob();
    const ref = this.afStorage.ref("pictures/a");
    const a = await ref.put(pic);
    console.log("up", a);

    // const photo = await Plugins.Camera.getPhoto({
    //   quality: 50,
    //   correctOrientation: true,
    //   height: 500,
    //   width: 300,
    //   resultType: CameraResultType.DataUrl,
    //   allowEditing: true,
    // });
    // await Photos.getPhotos().then((a) => console.log("aaaaaaa", a.photos[0].data));

    // conclusion:
    // - definitely use that plugin you just got, that way you can even select multiple photos
    // - use that base64toblob to send pictures to database
    // -

    // const ref = this.afStorage.ref("pictures/");
    // const blob = b64toBlob(photo.base64String);

    // const a = await ref.put(blob);

    // console.log("up", a);
  }
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
