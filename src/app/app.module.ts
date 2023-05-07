import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './modules/game/board/board.component';
import { CellComponent } from './modules/game/cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CellComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
