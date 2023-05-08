import { Board } from 'src/app/interfaces/board';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cell } from 'src/app/interfaces/cell';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnDestroy, OnInit{

  public game! : Game;
  private gameSubscription!: Subscription;

  public board! : Cell[][]

  constructor(
    private gameService: GameService,
    ){
      this.gameSubscription = this.gameService.game$.subscribe((game) =>{
        this.game = game;
      })
      this.board = this.gameService.game.board;
  }

  ngOnInit(){
    this.gameService.gameStarted();
  }

  ngOnDestroy(){
    console.log('Componente Board destruido')
    this.gameSubscription.unsubscribe();
  }
}
