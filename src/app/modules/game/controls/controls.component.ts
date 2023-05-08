import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Directions } from 'src/app/interfaces/enums/directions.enum';
import { types } from 'src/app/interfaces/enums/types.enum';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnDestroy, OnInit {

  //TODO poner la logica del gameover fuera de este componente

  public game! : Game;
  private gameSubscription!: Subscription;

  constructor(
    private gameService: GameService,
    ){
      this.gameSubscription = this.gameService.game$.subscribe((game) =>{
        this.game = game;
      })
  }

  turnLeftHero(){
    this.game.gameMessage = "";
    if(!this.game.heroDeath && !this.game.playerWin){
      this.addMove();
      this.game.heroDirection = this.game.heroDirection == 0 ? 3 : this.game.heroDirection - 1;
    }
    this.gameService.emitGame(this.game);
  }

  turnRightHero(){
    this.game.gameMessage = "";
    if(!this.game.heroDeath && !this.game.playerWin){
      this.addMove();
      this.game.heroDirection = this.game.heroDirection == 3 ? 0 : this.game.heroDirection + 1;
    }
    this.gameService.emitGame(this.game);
  }

  moveHero(){
    this.game.gameMessage = "";
    if(!this.game.heroDeath && !this.game.playerWin){
      this.addMove()
      switch (this.game.heroDirection) {
          case Directions.UP:
              this.moveHeroUp();
              break;
          case Directions.DOWN:
              this.moveHeroDown();
              break;
          case Directions.LEFT:
              this.moveHeroLeft();
              break;
          case Directions.RIGHT:
              this.moveHeroRight();
              break;
      }
      if(this.gameService.isCellOccupiedByKiller(this.game.heroPosition.row,this.game.heroPosition.col))
        this.gameService.gameOver(this.game.heroPosition.row,this.game.heroPosition.col) 
      else{  
        this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].hero=true; 
        this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].shown=true; 
      }
      this.gameService.emitGame(this.game);
    }
  }

  moveHeroUp(){
    if(this.game.heroPosition.row > 0){
      this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].hero=false;
      this.game.heroPosition.row--;
    }
    else this.game.gameMessage = "Against the wall";
  }

  moveHeroDown(){
    if(this.game.heroPosition.row < this.game.board.length - 1){
      this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].hero = false;
      this.game.heroPosition.row++;
    }
    else this.game.gameMessage = "Against the wall";
  }

  moveHeroLeft(){
    if(this.game.heroPosition.col > 0){
      this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].hero=false;
      this.game.heroPosition.col--;
    }
    else this.game.gameMessage = "Against the wall";
  }

  moveHeroRight(){
    if(this.game.heroPosition.col < this.game.board[0].length - 1){
      this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].hero=false;
      this.game.heroPosition.col++;
    }
    else this.game.gameMessage = "Against the wall";
  }

  getGold(){
    this.game.gameMessage = ""
    let cell = this.game.board[this.game.heroPosition.row][this.game.heroPosition.col];
    this.addMove()
    cell.content.forEach( item => { 
      if(item.takeable){
        this.game.score += 1000;
        this.game.hasGold = true;
        this.game.gameMessage = "You got the gold!"
      } 
    })
      cell.content = cell.content.filter(item => !item.takeable);
      this.gameService.emitGame(this.game);
  }

  ngOnInit(): void {
    this.gameService.gameStarted();
  }

  addMove(){
    this.game.totalMoves++;
  }

  exit(){
    if(!this.game.heroDeath && !this.game.playerWin){
      if(this.game.hasGold && this.gameService.heroIsAtExit()){
        this.game.playerWin = true;
        this.game.gameMessage = "YOU WIN!"
      }
      else if(!this.game.hasGold && this.gameService.heroIsAtExit()){
        this.game.gameMessage = "Get the gold to get out";
      }
      else if(!this.gameService.heroIsAtExit()){
        this.game.gameMessage = "Go to door";
      }
      this.gameService.emitGame(this.game);
    }
  }

  shot(){
    this.game.gameMessage = "";
    
    if(!this.game.heroDeath && !this.game.playerWin){
      this.addMove()
      if(this.game.arrows != 0 && !this.game.heroDeath){
        this.game.arrows--;
        switch (this.game.heroDirection) {
          case Directions.UP:
            if(this.game.heroPosition.col == this.game.monsterPosition.col && this.game.heroPosition.row > this.game.monsterPosition.row) this.monsterKilled();
            break;
          case Directions.DOWN:
            if(this.game.heroPosition.col == this.game.monsterPosition.col && this.game.heroPosition.row < this.game.monsterPosition.row) this.monsterKilled();
            break;
          case Directions.LEFT:
            if(this.game.heroPosition.col > this.game.monsterPosition.col && this.game.heroPosition.row == this.game.monsterPosition.row) this.monsterKilled();
            break;
          case Directions.RIGHT:
            if(this.game.heroPosition.col < this.game.monsterPosition.col && this.game.heroPosition.row == this.game.monsterPosition.row) this.monsterKilled();
            break;
        }
        if(!this.game.monsterDeath){
          this.game.gameMessage = "Fail!"
        }
      }
    }

    this.gameService.emitGame(this.game);
  }

monsterKilled(){
    this.game.monsterDeath = true;
    let row: number = this.game.monsterPosition.row;
    let col: number = this.game.monsterPosition.col;

    this.game.board[row][col].content = this.game.board[row][col].content?.filter(content => content.type != types.OBJECT);
    //TODO buscar otra manera de eliminar las pistas del monstruo que nos sea mediante un string
    if(row > 0){
      this.game.board[row - 1][col].content = this.game.board[row - 1][col].content?.filter(content => content.name != "monsterTrack" );
    }
    if(row < this.game.cells - 1){
      this.game.board[row + 1][col].content = this.game.board[row + 1][col].content?.filter(content => content.name != "monsterTrack" );
    }
    if(col > 0){
      this.game.board[row][col - 1].content = this.game.board[row][col - 1].content?.filter(content => content.name != "monsterTrack" );
    }
    if(col < this.game.cells - 1){
      this.game.board[row][col + 1].content = this.game.board[row][col + 1].content?.filter(content => content.name != "monsterTrack" );
    }
    
    this.game.gameMessage = "You killed the Wumpus!"
  }

  ngOnDestroy(): void {
    console.log('componente Controls destruido');
    this.gameSubscription.unsubscribe();
  }
}
