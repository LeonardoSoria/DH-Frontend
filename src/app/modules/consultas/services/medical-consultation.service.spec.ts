import { TestBed } from '@angular/core/testing';

import { MedicalConsultationService } from './medical-consultation.service';

describe('MedicalConsultationService', () => {
  let service: MedicalConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalConsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
