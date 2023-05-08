import { Component, Input, OnInit } from '@angular/core';
import { Cell } from 'src/app/interfaces/cell';
import { Directions } from 'src/app/interfaces/enums/directions.enum';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit{
  @Input() cell! : Cell;
  @Input() heroDirection! : Directions;
  @Input() arrows! : number;

  constructor(){
  }
  
  ngOnInit(): void {
    //console.log(this.cell)
  }
}
