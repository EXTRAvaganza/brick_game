import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {GameModule} from './modules/game/game.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GameComponent} from './modules/game/components/game/game.component'
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GameModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
