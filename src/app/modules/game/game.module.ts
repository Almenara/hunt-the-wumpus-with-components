import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { GameComponent } from './game.component';


@NgModule({
  declarations: [
    GameComponent,
    BoardComponent,
    CellComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
