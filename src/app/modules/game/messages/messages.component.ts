import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnDestroy{
  public message : string = "";
  private gameSubscription!: Subscription;

  constructor(
    private gameService: GameService,
    ){
      this.gameSubscription = this.gameService.game$.subscribe((game) =>{
        this.message = game.gameMessage;
      })
  }

  ngOnDestroy(): void {
    console.log('componente Messages destruido');
    this.gameSubscription.unsubscribe();
  }
}
