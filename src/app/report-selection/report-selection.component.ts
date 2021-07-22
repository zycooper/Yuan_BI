import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-report-selection',
  templateUrl: './report-selection.component.html',
  styleUrls: ['./report-selection.component.scss']
})
export class ReportSelectionComponent implements OnInit {
@Input() Reports;
@Output() Report = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }

  public sidebarMinimized = false;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  selectReport(value) {    
    this.Report.emit(value);
  }
}
