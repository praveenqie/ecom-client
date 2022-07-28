import { TestBed } from '@angular/core/testing';

import { CreditCardFormService } from './credit-card-form.service';

describe('CreditCardFormService', () => {
  let service: CreditCardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditCardFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
