import { TestBed } from '@angular/core/testing';

import { ErrandService } from './errand.service';

describe('ErrandService', () => {
  let service: ErrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
