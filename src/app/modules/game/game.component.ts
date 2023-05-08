import { GameService } from './../../services/game.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { game } from 'src/app/models/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  game!:game;
  
  @Output() gameOver = new EventEmitter<boolean>();

  constructor(
    private gameService: GameService,
    private router : Router,
  ){
    if(!gameService.game) router.navigate(["start"]);
  }

  closeGame(){
    this.gameOver.emit(true);
  }

  ngOnInit(){

  }
  
}
