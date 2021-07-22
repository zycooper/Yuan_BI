import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,of } from 'rxjs';
import data from '../src/assets/dummyData.json';

@Injectable({
  providedIn: 'root'
})
export class RetrieveDataService {
  constructor(private http: HttpClient) {}

  retrieveRawData(Report_ID_Name: string) : Observable<any> 
  {
    let rawData = [];    
    data.forEach(x => { if(x.report_Name == Report_ID_Name){ rawData = x.data;}});
    return of(rawData);
  }

  retrieveReports() : Observable<any> 
  {
    let reportnames = [];
    data.forEach(x => { reportnames.push(x.report_Name)});      
    return of(reportnames);
  }

  retrieveReportDetail(Report_ID_Name: string) : Observable<any> 
  {
    let report ;
    data.forEach(x => {if(x.report_Name == Report_ID_Name){ report = x}} );    
    return of(report);
  } 
} 