import { Component, OnInit, Input, EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'app-updates',
  templateUrl: './updates-selection.component.html',
  styleUrls: ['./updates-selection.component.scss']
})
export class UpdatesSelectionComponent{
@Input() Update_Timestamps:[];
@Output() applyUpdates = new EventEmitter<string>();

  constructor() { }

  addNewItem(value: string){
    this.applyUpdates.emit(value);
  }
}