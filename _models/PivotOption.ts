import { PivotFunc, TotalColPosition, TotalRowPosition } from "../_service/pivotData.service";

export interface PivotOption {
    columnX : string ,
    ColumnY_List : string[] ,
    TtlColPos : TotalColPosition ,
    TtlRowPos : TotalRowPosition ,
    X_axis_asc : boolean ,
    y_axis_asc : boolean ,
    isPercentage : boolean ,
    func : PivotFunc,
    valueIfNull: string,
    showEmptyItemInPivot: boolean
  }