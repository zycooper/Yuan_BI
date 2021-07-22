/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PivotDataService } from './pivotData.service';

describe('Service: PivotData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PivotDataService]
    });
  });

  it('should ...', inject([PivotDataService], (service: PivotDataService) => {
    expect(service).toBeTruthy();
  }));
});
