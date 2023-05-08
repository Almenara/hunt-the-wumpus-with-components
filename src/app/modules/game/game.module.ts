import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { GameComponent } from './game.component';
import { ControlsComponent } from './controls/controls.component';
import { ScorerComponent } from './scorer/scorer.component';
import { MessagesComponent } from './messages/messages.component';


@NgModule({
  declarations: [
    GameComponent,
    BoardComponent,
    CellComponent,
    ControlsComponent,
    ScorerComponent,
    MessagesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
