import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {
  constructor() { }
  public FilterDataAll(SourceData, filter_list:any[]) {
  var selfRef = this;  
  /*
    each filter_item:
    1. Col_Name: string
    2. Col_Value: string || string[] (base on in or contain)

    each filter_array: filter_item[]

    filter_list:
    1. filter_type: string ('In','Not_In','Contain','Not_Contain')
    2. filter_array
 */
    let result =  SourceData.filter(function(row){
      /*----- below is new  -----*/
      let temp_result:boolean = true;
      for (let i = 0; i < filter_list.length; i++) {
        //every element of i should be  &&
        //i ---> all && between four top level filter
        //i:
        //0 - 'In'
        //1 - 'Not_In'
        //2 - 'Contain'
        //3 - 'Not_Contain'
        let filter_type = filter_list[i].Filter_Type;
        let base_result: boolean = true;
        if (filter_list[i].Filter_Array.length > 0) 
        {
          for (let j = 0; j < filter_list[i].Filter_Array.length; j++) {            
            //j ---> all && between filter_item
            //check if filter array has data          
            let col_name = filter_list[i].Filter_Array[j].Col_Name;
            let col_value = filter_list[i].Filter_Array[j].Col_Value;
            //the current cell value in full data
            let rawData = row[col_name];              
            if (Array.isArray(col_value)) {
              //in or not in  -----> Col_Value is array
              //if not     -> any k matches row value, return false
              //if normail -> any k matchss row value, return true              
              let notFilterIndicator = filter_type.includes('Not');
              //let temp_match:boolean = false;              
              for (let k = 0; k < col_value.length; k++) {
                //k --->  different && or || base on values inside Col_Value
                let deletek = col_value[k];
                let temp_result_i = selfRef.ValueMatch(rawData, col_value[k],true);
                if (notFilterIndicator && temp_result_i) {                  
                  base_result = false;
                  break;
                }else if(!notFilterIndicator && temp_result_i){                  
                  base_result = true;
                  break;
                }else if(notFilterIndicator && !temp_result_i){
                  //no need to do anything since base_result is true by default
                }else if(!notFilterIndicator && !temp_result_i){
                  base_result = false;
                }              
              }              
            } else {
              //like or not like -----> Col_Value is string
              //no for loop because only one string per Col_Value
              //if values match and filter: Not_Contain ->
              let temp_result_i = selfRef.ValueMatch(rawData, col_value,false);
              base_result = filter_type.includes('Not')?(!temp_result_i):(temp_result_i);
              debugger
            }
            temp_result = temp_result && base_result;            
          }
          // j
        }
      // i
      }
      /*----- above is new  -----*/    
      //if nothing match filters above return true      
      return temp_result;
    });    
    return result;
  }
 private ValueMatch(rawData:string,filter_data:string,exactly:boolean):boolean {
    //above is old data which doesn't work
    /*exactly -> true : IN or Not IN | false -> Like or Not Like*/
    if (
      rawData !== undefined &&
      rawData !== '' &&
      filter_data !== undefined &&
      filter_data !== '' &&
      (exactly? (/* IN */rawData.toString() === filter_data.toString()):(/* Contains */rawData.toString().includes(filter_data.toString())))
    ) {      
      return true;
    }else{      
      return false;
    }
  }
}   