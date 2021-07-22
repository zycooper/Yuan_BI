import { ExportToCSVService } from './../../../_service/exportToCSV.service';
import { PivotOption } from './../../../_models/PivotOption';
import { ColumnPack } from './../../../_models/ColumnPack';
import { PivotDataService, PivotFunc } from './../../../_service/pivotData.service';
import { Component, OnInit } from '@angular/core';
import { RetrieveDataService } from '../../../_service/retrieveData.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FilterDataService } from '../../../_service/filterData.service';
import { LoadingModalComponent } from '../loading-modal/loading-modal.component';

@Component({
  selector: 'app-aging-report',
  templateUrl: './aging-report.component.html',
  styles: [`.card-header-setting {padding: 0.40rem 1.25rem;text-align: center;}
            .center-text{text-align: center;}
            .td-aging{border-style:groove;border-width: 1px;border-collapse:collapse;font-size:11pt; font-family: Calibri, sans-serif, serif, EmojiFont;width:1px;text-align: center;}             
          `],
  providers: [NgbModalConfig, NgbModal]
})

export class AgingReportComponent implements OnInit {  
  //raw data - all
  public FullData;   
  public FilteredData;  
  //reports 
  public Reports;
  //after pivot, the data
  public PivotData:any[];
  //modal detail data col
  public DetailDataHeaderRow: any[];
  //modal detail data
  public DetailDataRow = [];
  
  public modal_data;
  public SelectedReport: string;
  //public SelectedUpdate: string;
  public SelectedXaxisCol: string;
  public SelectedYaxisCols: string[];

  public YaxisColsForComponent: string[];
  public XaxisColsForComponent: string[];
  public RestColumns: string[];
  public FillColArr: string[];
 
  public TotalRowPositionArr = ['None','Top','Bottom'];
  public TotalColPositionArr = ['None','Left','Right'];
  public SelectedTtlRowPos:string = 'None';
  public SelectedTtlColPos:string = 'None';

  public YaxisSortArr = ['ASC','DESC'];
  public XaxisSortArr = ['ASC','DESC'];
  public YaxisSort:string = 'ASC';
  public XaxisSort:string = 'ASC';

  public IsPercentageArr = ['True','False'];
  public IsPercentage:string ='False';

  public WrapTextArr = ['True','False'];
  public WrapText:string ='True';

  public PivotFunArr = ['Count','Sum','Avg','Max','Min']
  public SelectPivotFunc:string ='Count';

  public SelectPivotFunCol:string;

  public ModalFilter:string; 
  //the result filter select on filter seciton
  //the detail one will duplicate this one then push selected x/y into it
  public Filter =  [];
  constructor( 
    private _dataservice: RetrieveDataService,
    private _pivot: PivotDataService,
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private _filter: FilterDataService,
    private _csv:ExportToCSVService
   ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.resetFilter();
    this.RetrieveReportList();
  }
  CurrentPivotOption():PivotOption {  
    return {
      columnX : this.SelectedXaxisCol,
      ColumnY_List : this.SelectedYaxisCols,
      TtlColPos : this.TotalColPositionArr.indexOf(this.SelectedTtlColPos),
      TtlRowPos : this.TotalRowPositionArr.indexOf(this.SelectedTtlRowPos) ,
      X_axis_asc :  (this.XaxisSort ==='ASC') ? true: false ,
      y_axis_asc :  (this.YaxisSort ==='ASC') ? true: false ,
      isPercentage :  (this.IsPercentage ==='True') ? true: false ,
      func : new PivotFunc(this.PivotFunArr.indexOf(this.SelectPivotFunc),this.SelectPivotFunCol),
      valueIfNull: 'null_value',
      showEmptyItemInPivot: false
    }
  }
  RetrieveReportList() {
    this.setReportLoading(true);
    this._dataservice.retrieveReports().subscribe( x=> {
      this.Reports = x;
    },complete => {
    this.setReportLoading(false);
    });
  }
  setReportLoading(loading:boolean){
    //console.log(loading)
  }
  loadData() {
    this.modalService.open(LoadingModalComponent,{centered: true,size: 'sm'});    
    this._dataservice.retrieveRawData(this.SelectedReport).subscribe(data => 
      {
        this.FullData = data;
        this.DetailDataHeaderRow = Object.keys(this.FullData[0]);
        this.FilteredData = this._filter.FilterDataAll(this.FullData,this.Filter);        
        this.PivotData = this._pivot.GetPivotData(this.FilteredData,this.CurrentPivotOption());
        this.modalService.dismissAll(LoadingModalComponent);        
      });
  }

  PopulateTbl() {    
    if (this.SelectedYaxisCols !== undefined && this.SelectedXaxisCol !== undefined) {      
      if (this.FullData !== undefined) {        
        this.FilteredData = this._filter.FilterDataAll(this.FullData,this.Filter);
        this.PivotData = this._pivot.GetPivotData(this.FilteredData,this.CurrentPivotOption());             
      }
      else {
        this.loadData();        
      }
    }
  }

  setColumns(selectColumns:ColumnPack) {     
    this.SelectedXaxisCol = selectColumns.X;
    this.SelectedYaxisCols = selectColumns.Y;    
    this.PopulateTbl();
  }
  setReport(selectReport: string) {    
    //set the current report 
    if (this.SelectedReport !==selectReport) {      
      this.modalService.open(LoadingModalComponent,{centered: true,size: 'sm'});

      this.SelectedReport = selectReport;
        
      if(this.SelectedReport) {      
        //set the report settings
        this._dataservice.retrieveReportDetail(this.SelectedReport).subscribe(res => {
          const col_temp:string[] = res.columns;
          this.FillColArr = res.columns;
          this.XaxisColsForComponent = [];
          
          //set X
          this.XaxisColsForComponent.push(res.rowPivot);
          this.SelectedXaxisCol = res.rowPivot;
  
          //set Y
          this.YaxisColsForComponent = res.columnPivot;
          this.SelectedYaxisCols = res.columnPivot;
  
          //remove columnPivot items
          for (let i = 0; i < this.YaxisColsForComponent.length; i++) {      
            const indexCol = col_temp.indexOf(this.YaxisColsForComponent[i], 0);
            if (indexCol > -1) {
              col_temp.splice(indexCol, 1);
            }
          }
  
          //remove rowPivot
          const indexRow = col_temp.indexOf(this.XaxisColsForComponent[0], 0);
          if (indexRow > -1) {
            col_temp.splice(indexRow, 1);
          }
  
          this.RestColumns = col_temp;

          //set filter data
          //set raw data
          this.resetFilter();          
          this.loadData();
        });       
      }
    }
  }
  setTtlRowPos(Pos:string) {      
    this.SelectedTtlRowPos = Pos;   
    this.PopulateTbl();
  }
  setTtlColPos(Pos:string) {    
    this.SelectedTtlColPos = Pos;
    this.PopulateTbl();
  }
  setYSort(Sort:string) {
    this.YaxisSort = Sort;
    this.PopulateTbl();
  }
  setXSort(Sort:string) {
    this.XaxisSort = Sort;
    this.PopulateTbl();
  }
  setIsPercentage(Is:string) {
    this.IsPercentage = Is;
    this.PopulateTbl();
  }
  setWrapText(Wrap: string) {
    this.WrapText = Wrap;
  }
  setPivotFunc(Func:string) {
    document.getElementById("btn_pivot_func").innerText=Func;
    this.SelectPivotFunc = Func;
    this.PopulateTbl();
  }
  setPivotFuncCol(Col:string) {
    document.getElementById("btn_pivot_func_col").innerText=Col;
    this.SelectPivotFunCol = Col;
    this.PopulateTbl();
  }
  exportToCSV() {
    this._csv.exportToCsv('file.csv',this.modal_data);
  }
  //filter related code below
  openDetailModal(content,i,j) {    
    //not set clickable
    //i row index
    //j col index
    
    //first row and number of y axis number column, and the cell with '-' in it - not render clickable or give the permission to open modal
    if (i !== 0 && j >= this.SelectedYaxisCols.length && this.PivotData[i][j] !== '-') {
      //add select col into filter      
      this.ModalFilter ='['+ this.SelectedXaxisCol + '] value : [' + this.PivotData[0][j] +']';
      
      //the array with select x/y axis value which will be push into main filter
      let arrayWithXYValuePushToMainFilter = [];
      //add x
      if (this.PivotData[0][j] !== 'Total') {
        arrayWithXYValuePushToMainFilter.push({Col_Name:this.SelectedXaxisCol,Col_Value:[this.PivotData[0][j]]});        
      }
      //add y
      for (let index = 0; index < this.SelectedYaxisCols.length; index++) {
        if (this.PivotData[i][this.SelectedYaxisCols.length-1] !== 'Total') {
          arrayWithXYValuePushToMainFilter.push({Col_Name:this.SelectedYaxisCols[index], Col_Value:[this.PivotData[i][index]]});
        }
      }
      
      this.DetailDataRow = [];      
      //data
      this.modal_data = this._filter.FilterDataAll(this.FilteredData,this.pushArrayToAnother(arrayWithXYValuePushToMainFilter,this.currentFilterDuplicate(this.Filter)));      
      for (let i = 0; i < this.modal_data.length; i++) {
        this.DetailDataRow.push(Object.values(this.modal_data[i]));
      }
      this.modalService.open(content,{scrollable: true,size: 'xl' });
    }
  }
  setFilter(filter){    
    this.Filter = filter;
    this.PopulateTbl();
  }
  currentFilterDuplicate(filter): any[] {
    //deep copy filter
    //return another object of this.Filter
    let duplicate = 
    [ 
      {Filter_Type:"In", Filter_Array: []},
      {Filter_Type:"Not_In", Filter_Array: []},
      {Filter_Type:"Contain", Filter_Array: []},
      {Filter_Type:"Not_Contain", Filter_Array: []}
    ];

    if (filter.length > 0) {
      for (let index = 0; index < filter.length; index++) {
        if (filter[index].Filter_Array > 0) {
          for (let j = 0; j < filter[index].Filter_Array.length; j++) {            
            switch (filter[index].Filter_Type) {
              case 'In':
                duplicate[0].Filter_Array.push(
                  {
                    Col_Name:filter[index].Filter_Array[j].Col_Name,
                    Col_Value: filter[index].Filter_Array[j].Col_Value.slice()
                  })
              break;
              case 'Not_In':
                duplicate[1].Filter_Array.push(
                  {
                    Col_Name:filter[index].Filter_Array[j].Col_Name,
                    Col_Value: filter[index].Filter_Array[j].Col_Value.slice()
                  })
              break;
              case 'Contain':
                duplicate[2].Filter_Array.push(
                  {
                    Col_Name:filter[index].Filter_Array[j].Col_Name,
                    Col_Value: (' ' + filter[index].Filter_Array[j].Col_Value).slice(1)
                  })           
              break;
              case 'Not_Contain':
                duplicate[3].Filter_Array.push(
                  {
                    Col_Name:filter[index].Filter_Array[j].Col_Name,
                    Col_Value: (' ' + filter[index].Filter_Array[j].Col_Value).slice(1)
                  })   
              break;
              
              default:
                break;
            } 
          }
        }       
      }      
    }
    
    return duplicate;    
  }
  pushArrayToAnother(fromArray,toArray):any[] {
    //push the select x/y value filter from "fromArray" to the target filter "toArray"
    //the toArray is a duplicate one of this.Filter
    toArray.forEach(x => {
        if (x.Filter_Type === 'In') {          
          //only add select detail filter to the in since no other filter type will join upon this step
          if (x.Filter_Array.length > 0) {
            //check if this Col_Name already exist                        
            for (let fromIndex = 0; fromIndex < fromArray.length; fromIndex++) {
              
              let added:boolean = false;

              for (let i = 0; i < x.Filter_Array.length; i++) {
                if (x.Filter_Array[i].Col_Name === fromArray[fromIndex].Col_Name) {

                  for (let index = 0; index < fromArray[fromIndex].Col_Value.length; index++) {                   
                    if (!x.Filter_Array[i].Col_Value.includes(fromArray[fromIndex].Col_Value[index])) {
                      x.Filter_Array[i].Col_Value.push(fromArray[fromIndex].Col_Value[index]);
                    }
                  }                  
                  added = true;
                }
              }

              if (!added) {
                //there is no such filter exist
                x.Filter_Array.push(fromArray[fromIndex]);
              }
            }
          }
          else{
            //no existing filter array, push directly
            for (let fromIndex = 0; fromIndex < fromArray.length; fromIndex++) {
              x.Filter_Array.push(fromArray[fromIndex]);              
            }
          }
        }
      });
    return toArray;
  }
  resetFilter() {
      ////clear all the previous filter, then fill it with the filter section ones
      this.Filter = [{Filter_Type:"In", Filter_Array: []},
      {Filter_Type:"Not_In", Filter_Array: []},
      {Filter_Type:"Contain", Filter_Array: []},
      {Filter_Type:"Not_Contain", Filter_Array: []}];
  }
} 