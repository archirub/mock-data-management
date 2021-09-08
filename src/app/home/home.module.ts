import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

import { HomePageRoutingModule } from "./home-routing.module";
import { HomePage } from "./home.page";
import { LogInComponent } from "./log-in/log-in.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, LogInComponent],
})
export class HomePageModule {}
