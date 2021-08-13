import { TestBed } from '@angular/core/testing';

import { GuiasService } from './guias.service';

describe('GuiasService', () => {
  let service: GuiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
