import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-scorer',
  templateUrl: './scorer.component.html',
  styleUrls: ['./scorer.component.scss']
})
export class ScorerComponent implements OnDestroy{
  public moves!: number;
  public hasGold!: boolean;
  public monsterDeath!: boolean;
  public arrows!: number;
  private gameSubscription!: Subscription;

  constructor(
    private gameService: GameService,
    ){
      this.gameSubscription = this.gameService.game$.subscribe((game) =>{
        this.moves        = game.totalMoves;
        this.hasGold      = game.hasGold;
        this.arrows       = game.arrows;
        this.monsterDeath = game.monsterDeath
      })
  }

  ngOnDestroy(): void {
    console.log('componente Scorer destruido');
    this.gameSubscription.unsubscribe();
  }
}