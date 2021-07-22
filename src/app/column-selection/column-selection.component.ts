import { Component, Input, OnInit, Output,EventEmitter, SimpleChanges } from '@angular/core';
import { ColumnPack } from '../../../_models/ColumnPack';

@Component({
  selector: 'app-column-selection',
  templateUrl: './column-selection.component.html',
  styleUrls: ['./column-selection.component.scss']
})
export class ColumnSelectionComponent {
@Input() columns:string[];
@Input() X_axis_cols:string[];
@Input() Y_axis_cols:string[];

@Output() applyColEvent = new EventEmitter<ColumnPack>();

  constructor() {}

  applyColumns(){
    if (this.X_axis_cols.length <=1) {      
      let col = {X:this.X_axis_cols[0],Y:this.Y_axis_cols}      
      this.applyColEvent.emit(col);
    }
  }
}

