import { Component, OnInit } from "@angular/core";
import { PictureUploadService } from "src/app/services/picture-upload.service";

@Component({
  selector: "app-picture-generator",
  templateUrl: "./picture-generator.component.html",
  styleUrls: ["./picture-generator.component.scss"],
})
export class PictureGeneratorComponent implements OnInit {
  picturesSelected: FileList;

  constructor(private pictureUploadService: PictureUploadService) {}

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
}
