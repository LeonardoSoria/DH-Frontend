import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalConsultationDoctorsComponent } from './medical-consultation-doctors.component';

describe('MedicalConsultationDoctorsComponent', () => {
  let component: MedicalConsultationDoctorsComponent;
  let fixture: ComponentFixture<MedicalConsultationDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalConsultationDoctorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalConsultationDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
