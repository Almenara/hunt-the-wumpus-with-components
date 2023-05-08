import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from '../modules/game/game.component';
import { StarterComponent } from '../modules/starter/starter.component';

const routes: Routes = [ 
  {
    path: 'start',
    pathMatch: 'full',
    component: StarterComponent
  },
  {
    path: 'game',
    pathMatch: 'full',
    component: GameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
