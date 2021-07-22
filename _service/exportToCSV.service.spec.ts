/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExportToCSVService } from './exportToCSV.service';

describe('Service: ExportToCSV', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportToCSVService]
    });
  });

  it('should ...', inject([ExportToCSVService], (service: ExportToCSVService) => {
    expect(service).toBeTruthy();
  }));
});
