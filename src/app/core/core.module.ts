import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { StarterComponent } from '../modules/starter/starter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameModule } from '../modules/game/game.module';


@NgModule({
  declarations: [
    StarterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule,
    GameModule
  ]
})
export class CoreModule { }
