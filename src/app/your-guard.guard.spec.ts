import { TestBed } from '@angular/core/testing';

import { YourGuardGuard } from './your-guard.guard';

describe('YourGuardGuard', () => {
  let guard: YourGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(YourGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
