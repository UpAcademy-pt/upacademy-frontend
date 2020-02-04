import { TestBed } from '@angular/core/testing';

import { ThemesServiceService } from './themes-service.service';

describe('ThemesServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThemesServiceService = TestBed.get(ThemesServiceService);
    expect(service).toBeTruthy();
  });
});
