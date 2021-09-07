import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MockDataPageRoutingModule } from "./mock-data-routing.module";

import { MockDataPage } from "./mock-data.page";

import { TestGeneratorComponent } from "./generators/test-generator/test-generator.component";
import { UserGeneratorComponent } from "./generators/user-generator/user-generator.component";
import { MatchGeneratorComponent } from "./generators/match-generator/match-generator.component";
import { ChatGeneratorComponent } from "./generators/chat-generator/chat-generator.component";
import { AccountGeneratorComponent } from "./generators/account-generator/account-generator.component";
import { PiGeneratorComponent } from "./generators/pi-generator/pi-generator.component";
import { PictureGeneratorComponent } from "./generators/picture-generator/picture-generator.component";
import { DeleteUsersComponent } from "./generators/delete-users/delete-users.component";
import { DeleteDataComponent } from "./generators/delete-data/delete-data.component";
import { DeleteStorageComponent } from "./generators/delete-storage/delete-storage.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MockDataPageRoutingModule],
  declarations: [
    MockDataPage,
    UserGeneratorComponent,
    TestGeneratorComponent,
    ChatGeneratorComponent,
    MatchGeneratorComponent,
    PiGeneratorComponent,
    AccountGeneratorComponent,
    PictureGeneratorComponent,
    DeleteUsersComponent,
    DeleteDataComponent,
    DeleteStorageComponent,
  ],
})
export class MockDataPageModule {}
