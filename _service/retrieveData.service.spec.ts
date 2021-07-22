/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RetrieveDataService } from './retrieveData.service';

describe('Service: RetrieveData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrieveDataService]
    });
  });

  it('should ...', inject([RetrieveDataService], (service: RetrieveDataService) => {
    expect(service).toBeTruthy();
  }));
});
