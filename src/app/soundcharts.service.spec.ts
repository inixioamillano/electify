import { TestBed } from '@angular/core/testing';

import { SoundchartsService } from './soundcharts.service';

describe('SoundchartsService', () => {
  let service: SoundchartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundchartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
