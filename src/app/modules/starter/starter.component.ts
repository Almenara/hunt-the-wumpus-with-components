import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent {
  public gameStarted : boolean = false;
  public game! :       Game | undefined;
  public maxHoles :    number = 2;

  public gameOptionsForm: FormGroup = this.fb.group({
    cells:  [4, [Validators.required, Validators.min(4), Validators.max(9)]],
    holes:  [2, [Validators.required, Validators.min(0), Validators.max(this.maxHoles)]],
    arrows: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  })
  
  constructor(
    private gameService: GameService,
    private fb: FormBuilder,
    private router: Router,
  ){}
  
  cellsChanges(){
    this.maxHoles = Math.round((this.gameOptionsForm.value.cells / 2) - 1) < 2 ? 2 : Math.round((this.gameOptionsForm.value.cells / 2) - 1);
    this.gameOptionsForm.controls['holes'].setValidators([Validators.required, Validators.min(0), Validators.max(this.maxHoles)]);
  }

  startGame() {
    this.gameService.setGame(this.gameOptionsForm.value);
    this.router.navigate(['game'])
  }

}
