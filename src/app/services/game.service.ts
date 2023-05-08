import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from '../interfaces/game';
import { Router } from '@angular/router';
import { Cell } from '../interfaces/cell';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  public game! : Game;

  
  constructor(
    private router : Router,
    ) {}
  setGame(newGame: Game){
    this.game = newGame;
    this.game.board = []
    if(this.game){
      this.createBoard()
    }
    else this.router.navigate(['start'])
  }

  createBoard(){
    for(let i = 0; i < this.game.cells; i++){

        let row: Cell[] = [];

        for(let e:number = 1; e < this.game.cells + 1 ; e++){
        
            row.push({
              id      : e + (i * this.game.cells),
              shown   : false,
              content : undefined,
              hero    : false
            });

        }
        
        this.game.board.push(row);
      
    }
    
    //this.addHeroOnStartCell();
    //this.addGameElementsToBoard();
    //console.log(this.board)
}
}
