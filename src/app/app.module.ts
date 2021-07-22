import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

// Import containers
import { AgingReportComponent } from './aging-report/aging-report.component';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { ColumnSelectionComponent } from './column-selection/column-selection.component';

import { DragulaModule } from 'ng2-dragula';
import { UpdatesSelectionComponent } from './updates-selection/updates-selection.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';
import { FilterSelectionComponent } from './filter-selection/filter-selection.component';
import { ButtonGroupToggleComponent } from './button-group-toggle/button-group-toggle.component';
import { NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';

// RECOMMENDED
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    DragulaModule.forRoot(),
    NgbModule,
    FormsModule
  ],
  declarations: [											
    AppComponent,  
    AgingReportComponent,
    ColumnSelectionComponent,
    UpdatesSelectionComponent,
      ReportSelectionComponent,
      FilterSelectionComponent,      
      ButtonGroupToggleComponent,
      LoadingModalComponent
   ],
  providers: [
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  NgbModalConfig,
  NgbModal],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
