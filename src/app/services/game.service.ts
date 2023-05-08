import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from '../interfaces/game';
import { Router } from '@angular/router';
import { Cell } from '../interfaces/cell';
import { types } from '../interfaces/enums/types.enum';
import { Directions } from '../interfaces/enums/directions.enum';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameSubject = new Subject<Game>();
  public game$ = this.gameSubject.asObservable();
  public game! : Game ;

  constructor(
    private router : Router,
    ) {}
  setGame(newGame: Game){

    this.game               = newGame;
    this.game.board         = []
    this.game.heroDirection = Directions.UP;
    this.game.totalMoves    = 0;
    this.game.hasGold       = false;
    this.game.monsterDeath  = false;
    this.game.playerWin     = false;
    this.game.heroDeath     = false;
    
    if(this.game){
      this.createBoard()
      this.emitGame(this.game)
    }
    else this.router.navigate(['start'])
  }

  emitGame(game: Game) {
    this.gameSubject.next(game);
  }

  createBoard(){
    for(let i:number = 0; i < this.game.cells; i++){

        let row: Cell[] = [];

        for(let e:number = 1; e < this.game.cells + 1 ; e++){
            let shown = i == this.game.cells - 1 && e - 1 == 0 ? true : false;
            row.push({
              id      : e + (i * this.game.cells),
              shown   : shown,
              content : [],
              hero    : false
            });

        }

        this.game.board.push(row);
      
    }
    
    this.addHeroOnStartCell();
    this.addGameElementsToBoard();
  }

  gameStarted(){
    this.emitGame(this.game)
  }

  addHeroOnStartCell(){

    this.game.heroPosition = {row : this.game.board.length - 1, col : 0 };
    this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].hero = true;

  }

  addGameElementsToBoard(){
    this.addGoldToBoard();
    this.addHoleToBoard();
    this.addMonsterToBoard();
  }

  addGoldToBoard(){
    let row = this.getRandomCell();
    let col = this.getRandomCell();
    if(!this.isCellOccupied(row, col))
        this.game.board[row][col].content?.push({
            type: types.OBJECT,
            kill: false, 
            takeable: true, 
            name: 'gold', 
            icon: '💰'
        });
    else this.addGoldToBoard();
  }

  addMonsterToBoard(){
      let row = this.getRandomCell();
      let col = this.getRandomCell();
      if(!this.isCellOccupied(row, col)){
          this.game.board[row][col].content = [];
          this.game.board[row][col].content.push({
              type: types.OBJECT,
              kill: true, 
              takeable: false, 
              name: 'monster', 
              icon: '👹'
          });
          this.game.monsterPosition = {row, col};
          this.addMonsterTracks(row,col);
      }
      else this.addMonsterToBoard();
  }

  addHoleToBoard(){
    for(let i = 0; i < this.game.holes; i ++){
        let row = this.getRandomCell();
        let col = this.getRandomCell();
        if(!this.isCellOccupied(row, col)){
            this.game.board[row][col].content = [];
            this.game.board[row][col].content.push({
                type: types.OBJECT,
                kill: true, 
                takeable: false, 
                name: 'hole', 
                icon: '🕳️'
            });
            this.addHoleTracks(row, col)
        }
        else i--;    
    }

  }

  addMonsterTracks(row: number, col: number){
    let monsterTruck = {
      type: types.TRACK,
      kill: false, 
      takeable: false, 
      name: 'monsterTrack', 
      icon: '💩'
    };
    if(row > 0 && !this.isCellOccupiedByKiller(row - 1, col)) this.game.board[row - 1][col].content.push(monsterTruck);
    if(row < this.game.cells - 1 && !this.isCellOccupiedByKiller(row + 1, col)) this.game.board[row + 1][col].content.push(monsterTruck);
    if(col > 0 && !this.isCellOccupiedByKiller(row, col - 1)) this.game.board[row][col - 1].content.push(monsterTruck);
    if(col < this.game.cells - 1 && !this.isCellOccupiedByKiller(row, col + 1)) this.game.board[row][col + 1].content.push(monsterTruck);
  }

  addHoleTracks(row: number, col: number){
    let HoleTrack = {
      type: types.TRACK,
      kill: false, 
      takeable: false, 
      name: 'holeTruck', 
      icon: '💨'
    }
    if(row > 0 && !this.isCellOccupiedByHoleTrack(row - 1, col) && !this.isCellOccupiedByKiller(row - 1, col))
      this.game.board[row - 1][col].content.push(HoleTrack);
    if(row < this.game.cells - 1 && !this.isCellOccupiedByHoleTrack(row + 1, col) && !this.isCellOccupiedByKiller(row + 1, col)) 
      this.game.board[row + 1][col].content.push(HoleTrack);
    if(col > 0 && !this.isCellOccupiedByHoleTrack(row, col - 1) && !this.isCellOccupiedByKiller(row, col - 1)) 
      this.game.board[row][col - 1].content.push(HoleTrack);
    if(col < this.game.cells - 1 && !this.isCellOccupiedByHoleTrack(row, col + 1) && !this.isCellOccupiedByKiller(row, col + 1)) 
    this.game.board[row][col + 1].content.push(HoleTrack);
  }

  isCellOccupied(row : number, col : number):boolean{
    if(row == this.game.cells - 1 && col == 0 )
      return true;
    if(!this.game.board[row][col].content.length)
      return false;
    return this.game.board[row][col].content.filter( element => element.type == types.OBJECT).length ? true : false;
  }
  isCellOccupiedByHoleTrack(row: number, col: number):boolean{
    return this.game.board[row][col].content.filter( element => element.name == "holeTruck").length ? true : false
  }
  isCellOccupiedByKiller(row: number, col: number):boolean{
    return this.game.board[row][col].content.filter( element => element.kill).length ? true : false
  }
  getRandomCell():number{
    return Math.floor(Math.random() * this.game.cells)
  }
  
  gameOver(row:number, col:number){
    this.game.heroDeath = true;
    this.game.board[this.game.heroPosition.row][this.game.heroPosition.col].shown=true
    this.game.gameMessage = "You died!"
  }

  heroIsAtExit(){
    return this.game.heroPosition.row == this.game.cells - 1 && this.game.heroPosition.col == 0;
  }
}
