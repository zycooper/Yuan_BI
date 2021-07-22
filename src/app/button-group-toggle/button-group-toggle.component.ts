import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-group-toggle',
  templateUrl: './button-group-toggle.component.html',
  styleUrls: ['./button-group-toggle.component.scss']
})
export class ButtonGroupToggleComponent implements OnInit {
@Input() OptionArray:[]
@Output() OptionSelect = new EventEmitter<string>();

selectedIndex: number = null;

  constructor() { }

  ngOnInit() {
  }
  
  selectOption(index:number)
  {
    this.selectedIndex = index;
    this.OptionSelect.emit(this.OptionArray[index]);    
  }
}
