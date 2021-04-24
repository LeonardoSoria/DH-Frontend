import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalConsultationPatientsComponent } from './medical-consultation-patients.component';

describe('MedicalConsultationPatientsComponent', () => {
  let component: MedicalConsultationPatientsComponent;
  let fixture: ComponentFixture<MedicalConsultationPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalConsultationPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalConsultationPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
