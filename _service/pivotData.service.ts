import { PivotOption } from './../_models/PivotOption';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PivotDataService {
/**
 * two main function: 1. get pivot data 2. get transpose data
 */
constructor() { }
/**
 * return a pivot data as a two dimensional array
 * @param Fulldata not null and no default value, the original raw data
 * @param columnX the column whose value will show up on the x-axis, default value is ''
 * @param ColumnY_List 
 * @param TtlColPos 
 * @param TtlRowPos 
 * @param X_axis_asc 
 * @param y_axis_asc 
 * @param isPercentage 
 * @param func 
 */
  public GetPivotData(Fulldata,option:PivotOption) {  
    //replace all empty data with '_Blank'
    Fulldata.forEach(data => {
      Object.keys(data).forEach(function(key){
        if (data[key] === null || data[key] ==='') {
          data[key] = '_Blank';          
        }
      })
    });    
      let Result = [];
      //Fulldata is a object array, each item is a object with key and value
      //if func is null, create new func
      let _pivotFunc : PivotFunc;
      if (option.func !== null) {
        _pivotFunc = option.func;
      }else {
        _pivotFunc = new PivotFunc(PivotFuncName.Count);
      }

      let X_axis_value : string[]=[];// distinct X_axis_value     
      let Y_axis_Pairs_pureArray = [];

      if (option.ColumnY_List !== null) {
        if (option.ColumnY_List.length >0 ) {
          for (let k = 0; k < option.ColumnY_List.length; k++) {
            //Y_axis_Pairs[ColumnY_List[k]] = {value: []}

            //old
            Y_axis_Pairs_pureArray.push({columnName:option.ColumnY_List[k],columnValues:[]});
          }
        }
      }

      //prepare data
      Fulldata.forEach(data => {

        //add value to X axis value
        if (option.columnX !=='') {
          if (!X_axis_value.includes(data[option.columnX])) {
            X_axis_value.push(data[option.columnX]);
          }
        }
      
        //add value to Y axis pair
        if (option.ColumnY_List !== null) {
          if (option.ColumnY_List.length > 0 ) {
            for (let j = 0; j < option.ColumnY_List.length; j++) {
              //old code to add value to Y_axis_Pairs_pureArray
              if (!Y_axis_Pairs_pureArray[j].columnValues.includes(data[option.ColumnY_List[j]])) {
                Y_axis_Pairs_pureArray[j].columnValues.push(data[option.ColumnY_List[j]]);
              }
            }
          }
        }
      });

      //sort value of X axis
      X_axis_value = this.SortArray(option.X_axis_asc,X_axis_value);

      //sort value of Y axis
      if (option.ColumnY_List !== null) {
        if (option.ColumnY_List.length > 0 ) {
          for (let j = 0; j < option.ColumnY_List.length; j++) {            
              Y_axis_Pairs_pureArray[j].columnValues = this.SortArray(option.y_axis_asc,Y_axis_Pairs_pureArray[j].columnValues)        
          }
        }
      }

      //convert colnames and values in Y_axis_Pairs into two-deimention array
      let pivot_list =this.Axis_Value_List(Y_axis_Pairs_pureArray,0);
          
      /**
        * build final result
        */

      //add first row - Columns
      let firstRow =[];

      //add y axis column name
      option.ColumnY_List.forEach(x => {firstRow.push(x);});

      //add x axis values
      X_axis_value.forEach(x => {firstRow.push(x);});      
      
      //add total column
      switch (option.TtlColPos) {
        
        case 0:
          //none
          break;
        case 1:
          //left
          firstRow.splice(option.ColumnY_List.length,0,'Total');
          break;
        case 2:
          //right
          firstRow.push('Total');
          break;      
        default:
          //none
          break;
      }

      Result.push(firstRow);

      //add value rows
      //each row
      for (let i = 0; i < pivot_list.length; i++) {
        let CellRow=[];
        let TotalCell=0;//the total cell value

        //push axis values
        for(let j = 0; j < pivot_list[i].length; j++)
        {
          CellRow.push(pivot_list[i][j]);
        }

        //push cell value
        //each column
        for(let k = 0; k < X_axis_value.length; k++)
        {
          let filter = [] //key is column name (index), value is column value

          //the filters below have nothing to do with the fulldata filter or detail data, they are just to build final pivot data
          //y-axis filters
          for(let l=0;l< option.ColumnY_List.length;l++)
          {
            filter.push({[`${option.ColumnY_List[l]}`] : pivot_list[i][l]});
          }
          
          //x-axis filter
          filter.push({[`${option.columnX}`] : X_axis_value[k]});
          // let filters = {
          //   filter_in : filter,
          //   filter_not_in: filter,
          //   filter_contains: filter,
          //   filter_not_contains: filter
          // }
          let rows = this.FilterData(Fulldata,filter);         

          //calculate these rows if they exist
          let Cal_result= "-";
          if(rows.length > 0)
          {
            switch(_pivotFunc.PivotFuncName)
            {
                /*  
                  Cal Func Code: 
                  0. Count
                  1. Sum
                  2. Avg
                  3. Max
                  4. Min
                */
              case 0:
                Cal_result = rows.length;
                TotalCell += +Cal_result;
              break;
              case 1:
                if(_pivotFunc._column != "" && _pivotFunc._column  != undefined)
                {
                  Cal_result = rows.sum(_pivotFunc._column );
                  TotalCell += +Cal_result;
                }
              break;
              case 2:
                if(_pivotFunc._column  != "" && _pivotFunc._column  != undefined)
                {
                  Cal_result = rows.avg(_pivotFunc._column );
                }
              break;
              case 3:
                if(_pivotFunc._column  != "" && _pivotFunc._column  != undefined)
                {
                  Cal_result = Math.max.apply(Math,rows.map(function(o){ return o[_pivotFunc._column ];}))
                }
              break;
              case 4:
                if(_pivotFunc._column  != "" && _pivotFunc._column  != undefined)
                {
                  Cal_result = Math.min.apply(Math,rows.map(function(o){ return o[_pivotFunc._column ];}))
                }
              break;
            }
          }
          CellRow.push(Cal_result);
        }
          if (TotalCell > 0) {
             //add total column cell value
             switch (option.TtlColPos) {
                  
              case 0:
                //none
               
                break;
              case 1:
                //left
                
                CellRow.splice(option.ColumnY_List.length,0,TotalCell);
                break;
              case 2:
                //right                
                CellRow.push(TotalCell);
                break;      
              default:
                //none
                break;
              }
 
              Result.push(CellRow);   
          }                               
      }

      //add total last row
      if (option.TtlRowPos !==0) {
        //has ttl row
        let TotalRow =[];
        for(let i=0; i< Y_axis_Pairs_pureArray.length-1;i++){TotalRow.push("-");/*null values to fill the bottom cell under y-axis-column value*/}
        TotalRow.push("Total");

        //fill total row
        for(let i =Y_axis_Pairs_pureArray.length;i < Result[0].length;i++)
        {
          let total_result =0;
          
          for(let j = 1 ; j < Result.length;j++)
          {         
            total_result += ((isNaN(Result[j][i]))? 0 : Result[j][i]);
          }
          
        TotalRow.push(total_result);
        }

        if (option.TtlRowPos ===1) {
          // top
          Result.splice(1,0,TotalRow);
        } else
        {
          //bottom
          Result.push(TotalRow);
        }
      }            
      return Result;
  }
  public SortArray(isASC,array){

    return array.sort((n1,n2) => {
      if (n1 > n2) {
          return (isASC)?1:-1;
      }
    
      if (n1 < n2) {
          return (isASC)?-1:1;
      }
    
      return 0;
    });
  }
  public SortDistinctValue(sort,_array)
  {
    if(!_array.some(isNaN))
    {
      //if all numbers, sort as numbers
      return sort 
      ? _array.filter((v, i, a) => a.indexOf(v) === i).sort(function(a,b) { return a - b; }) 
      : _array.filter((v, i, a) => a.indexOf(v) === i).sort(function(a,b) { return b - a; });       
    }
    else
    {
      return sort
      ? _array.filter((v, i, a) => a.indexOf(v) === i).sort() 
      : _array.filter((v, i, a) => a.indexOf(v) === i).reverse();
    }
  }
  public Axis_Value_List(Y_Axis_Pairs,i)
    {

      let _result=[];

      if(i> Y_Axis_Pairs.length-1)
      {    
      for(let j=0;j<Y_Axis_Pairs[Y_Axis_Pairs.length-1].columnValues.length;j++)
      {
        let temp_result=[];
        temp_result.push(Y_Axis_Pairs[Y_Axis_Pairs.length-1].columnValues[j])      
        _result.push(temp_result);       
      }       
      return _result;
      }
      else
      {
      let sample =this.Axis_Value_List(Y_Axis_Pairs,i+1);

      if(i > 0)
      {     
        for(let j=0; j< Y_Axis_Pairs[i-1].columnValues.length; j++)
        {
          let _result_replica = this.DeepCopy(sample);
          
          for(let k=0;k<_result_replica.length;k++)
          {          
            _result_replica[k].unshift(Y_Axis_Pairs[i-1].columnValues[j]);
            
          }
          
          _result=_result.concat(_result_replica);                   
        }
        
      }
      else
      {
        _result=sample;
      }

      return _result;   
      }
  }
  public DeepCopy(source)
  {
    let result =[];
    for(let i=0; i < source.length; i++)
    {
    let _list=[];

    for(let j=0; j < source[i].length;j++)
    {
      _list.push(source[i][j]);
    }

    result.push(_list);
    }

    return result;
  }
  public FilterData(SourceData, filters:any[]) {
    
    return SourceData.filter(function(row)
          {
            for(let m=0; m < filters.length; m++)
            {
              if(row[Object.keys(filters[m])[0]] === undefined || Object.values(filters[m])[0] != row[Object.keys(filters[m])[0]])
              {              
                return false;
              }
            }      
            return true;
          });
  }
}

export class PivotFunc {
  constructor(public PivotFuncName: PivotFuncName, public _column:string=''){}
}

export enum PivotFuncName { Count, Sum, Avg, Max,Min }
export enum TotalRowPosition { none, top, bottom }
export enum TotalColPosition { none, left, right }

// class StringArrayPair{
//   [colname:string] : { value: string[] };
// }

// Array.prototype.sum = function (prop) {
//   var result = 0
//   for ( var i = 0, _len = this.length; i < _len; i++ ) {
//     if(!isNaN(this[i][prop]))
//     {
//       result += this[i][prop]
//     }
//   }
//   return result;
// }

// Array.prototype.avg = function (prop) {
//   var result = 0
//   for ( var i = 0, _len = this.length; i < _len; i++ ) {
//     if(!isNaN(this[i][prop]))
//     {
//       result += this[i][prop]
//     }
//   }
//   if(this.length>0)
//   {return (result / this.length).toFixed(2)}
//   else
//   {return 0;}
// }   



    //let Y_axis_Pairs : StringArrayPair = {}; // Y_axis_Pairs is List<KeyValuePair<string, List<string>>> 
      //code below has issue, before the end of the loop, the Y_axis_Pairs has correct data, but after the loop, Y_axis_Pairs will remain undefined
      //but if you put a debugger before the end, and then click next function one step by step to finish this loop, Y_axis_Pairs works well

      // for (let i = 0; i < Fulldata.length; i++) {        
      //   //add value to X axis value
      //   if (columnX !=='') {
      //     if (!X_axis_value.includes(Fulldata[i][columnX])) {
      //       X_axis_value.push(Fulldata[i][columnX]);
      //     }
      //   }      
      //   //add value to Y axis pair
      //   if (ColumnY_List !== null) {
      //     if (ColumnY_List.length > 0 ) {

      //       for (let j = 0; j < ColumnY_List.length; j++) {                         
      //         if (!Y_axis_Pairs[ColumnY_List[j]].value.includes(Fulldata[i][ColumnY_List[j]])) {
      //             Y_axis_Pairs[ColumnY_List[j]].value.push(Fulldata[i][ColumnY_List[j]]);                
      //         }
      //       }
      //     }
      //   }
      //   if(i >= Fulldata.length-1){
      //     let iiii = i;          
      //     }          
      // }      

      // if (!Y_axis_Pairs[ColumnY_List[j]].value.includes(data[ColumnY_List[j]])) {
              //     Y_axis_Pairs[ColumnY_List[j]].value.push(data[ColumnY_List[j]]);
                  
              //     //Y_axis_Pairs
              //     /*
              //       {
              //         [colname: Status,value: ['HP','X7','B8']]
              //         ......
              //       }
              //     */
              // }


     //below is the sample code how to traverse Y_axis_Pairs, you have to use the ColumnY_List
      // for (let index = 0; index < ColumnY_List.length; index++) {
      //   const key = ColumnY_List[index];
      //   const value = Y_axis_Pairs[ColumnY_List[index]].value;        
      // }
    /*
     //sample code: show how to retrieve data from Fulldata
      for (let index = 0; index < Fulldata.length; index++) {
        //a row
        const element = Fulldata[index];
        //single value
        const electment_test = element['Bin_NO'];
        //columns list
        const key = Object.keys(element);
        //first column name
        const key1 = key[0];
      }
    */