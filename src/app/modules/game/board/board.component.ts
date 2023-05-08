import { Component, Input, OnInit } from '@angular/core';
import { Cell } from 'src/app/interfaces/cell';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{
  //@Input() board! : Board;

  public board! : Cell[][]

  constructor(
    private gameService: GameService,
    ){
      this.board = gameService.game.board;
  }
  ngOnInit(){
    
  }
}
