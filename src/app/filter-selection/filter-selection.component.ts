import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-selection',
  templateUrl: './filter-selection.component.html',
  styleUrls: ['./filter-selection.component.scss']
})
export class FilterSelectionComponent implements OnInit {
@Input() Columns:[]
@Input() FullData;
@Output() applyFilterEvent = new EventEmitter();

public ColForEqual: string;
public ColValueForEqual: string[];

public ColForLike: string;

public Filter_Result =  [];
private EqualFilterNotCheck: boolean = false;
private LikeFilterNotCheck: boolean = false;
public isCollapsed = true;

public multiSelect;
  constructor() {}

  ngOnInit() {
    //reset the filter result
    this.Filter_Result = 
    [{Filter_Type:"In", Filter_Array: []},//0
    {Filter_Type:"Not_In", Filter_Array: []},//1
    {Filter_Type:"Contain", Filter_Array: []},//2
    {Filter_Type:"Not_Contain", Filter_Array: []}];//3

    this.multiSelect = [];    
  }

  applyFilter() {
    if (this.Filter_Result.length > 0) {      
      this.applyFilterEvent.emit(this.Filter_Result);
    }
  }

  setEqualCol(col,equal=false){
    if (equal) {
      //equal
      this.ColForEqual = col;

      this.ColValueForEqual =[];
      for (let index = 0; index < this.FullData.length; index++) {
        if (!this.ColValueForEqual.includes(this.FullData[index][col])) {
          this.ColValueForEqual.push(this.FullData[index][col]);
        }
      }
    }else {
      //like
      this.ColForLike = col;
    }
  }
  checkCheckBoxvalue(event,type) {
    if (type ==='equal') {
      this.EqualFilterNotCheck = event.currentTarget.checked;
    } else {
      this.LikeFilterNotCheck = event.currentTarget.checked;
    }
  }
  addToFilter(col_name,value,type){
    //check this value will go to which filter type
    let filter_type_index = (type === 'equal' ?/*equal*/(this.EqualFilterNotCheck?/*not*/1:0):/*like*/(this.LikeFilterNotCheck?/*not*/3:2));

    if (this.Filter_Result[filter_type_index].Filter_Array.length > 0) {
      //check if this filter already  exists
      if (this.Filter_Result[filter_type_index].Filter_Array.some(fil => fil.Col_Name ===col_name)) {
        //this col already exist
        for (let i = 0; i < this.Filter_Result[filter_type_index].Filter_Array.length; i++) {
          if (this.Filter_Result[filter_type_index].Filter_Array[i].Col_Name === col_name) {
              this.Filter_Result[filter_type_index].Filter_Array[i].Col_Value = value;
          }
        }
      }else {
        //not exist
        this.Filter_Result[filter_type_index].Filter_Array.push({Col_Name: col_name,Col_Value: value});
      }
    } else {
      //empty, push directly
      this.Filter_Result[filter_type_index].Filter_Array.push({Col_Name: col_name,Col_Value: value});
    }
    //console.log(this.Filter_Result);
  }
  clearFilter(){
    this.Filter_Result = 
    [{Filter_Type:"In", Filter_Array: []},//0
    {Filter_Type:"Not_In", Filter_Array: []},//1
    {Filter_Type:"Contain", Filter_Array: []},//2
    {Filter_Type:"Not_Contain", Filter_Array: []}];//3

    this.applyFilter();
  }
}