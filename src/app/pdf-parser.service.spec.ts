import { TestBed } from '@angular/core/testing';

import { PdfParserService } from './pdf-parser.service';

describe('PdfParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfParserService = TestBed.get(PdfParserService);
    expect(service).toBeTruthy();
  });
});
