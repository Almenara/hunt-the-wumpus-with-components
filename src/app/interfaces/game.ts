import { Cell } from "./cell";
import { Directions } from "./enums/directions.enum";

export interface Game {
    cells           : number;
    holes           : number;
    arrows          : number;
    totalMoves      : number;
    score           : number;
    heroPosition    : {row : number , col : number};
    heroDirection   : Directions;
    heroDeath       : boolean;
    monsterDeath    : boolean;
    monsterPosition : {row : number , col : number};
    hasGold         : boolean;
    playerWin       : boolean;
    gameMessage     : string;  

    board           : Cell[][];   
}
