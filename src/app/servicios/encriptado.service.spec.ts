import { TestBed } from '@angular/core/testing';

import { EncriptadoService } from './encriptado.service';

describe('EncriptadoService', () => {
  let service: EncriptadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncriptadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
