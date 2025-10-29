import { TestBed } from '@angular/core/testing';

import { ConfirmationServiceDialogService } from './confirmation-service-dialog.service';

describe('ConfirmationServiceDialogService', () => {
  let service: ConfirmationServiceDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationServiceDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
