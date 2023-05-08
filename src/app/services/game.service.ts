import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from '../interfaces/game';
import { Router } from '@angular/router';
import { Cell } from '../interfaces/cell';
import { types } from '../interfaces/enums/types.enum';


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
              content : [],
              hero    : false
            });

        }

        this.game.board.push(row);
      
    }
    
    this.addHeroOnStartCell();
    this.addGameElementsToBoard();
    
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

}
