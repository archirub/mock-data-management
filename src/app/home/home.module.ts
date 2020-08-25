import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

import { HomePageRoutingModule } from "./home-routing.module";
import { HomePage } from "./home.page";

import { TestGeneratorComponent } from "./../generators/test-generator/test-generator.component";
import { UserGeneratorComponent } from "./../generators/user-generator/user-generator.component";
import { MatchGeneratorComponent } from "./../generators/match-generator/match-generator.component";
import { ConversationGeneratorComponent } from "./../generators/conversation-generator/conversation-generator.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    UserGeneratorComponent,
    TestGeneratorComponent,
    ConversationGeneratorComponent,
    MatchGeneratorComponent,
  ],
})
export class HomePageModule {}
