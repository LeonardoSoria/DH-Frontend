import {Component, OnInit, ViewChild} from '@angular/core';
import {MedicalConsultation} from '../../interface/medicalConsultation.interface';
import {Patient} from '../../../administracion/interfaces/patient.interface';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MedicalConsultationService} from '../../services/medical-consultation.service';
import {PatientService} from '../../../administracion/services/patient.service';
import {AlertService} from '../../../../ng-alerts/alert.service';
import {PageEvent} from '@angular/material/paginator';
import {Doctor} from '../../../administracion/interfaces/doctor.interface';
import {DoctorService} from '../../../administracion/services/doctor.service';

@Component({
  selector: 'app-medical-consultation-doctors',
  templateUrl: './medical-consultation-doctors.component.html',
  styleUrls: ['./medical-consultation-doctors.component.css']
})
export class MedicalConsultationDoctorsComponent implements OnInit {

  medicalConsultations: MedicalConsultation[] = [];
  doctors: Doctor[] = [];
  dataSource = new MatTableDataSource<Doctor>();
  displayedColumns: string[] = ['name', 'lastname', 'birthdate', 'address', 'speciality', 'actions'];
  @ViewChild(MatSort) sort = new MatSort();
  medicalConsultationsCant = 5;
  patientsCant = 5;
  value = '';
  showMedicalConsultation = false;
  spinner = false;

  constructor(private medicalConsultationService: MedicalConsultationService,
              private patientService: PatientService,
              private doctorService: DoctorService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(data => {
      this.doctors = data;
      this.dataSource.data = this.doctors.slice(0, 5);
      this.spinner = false;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.doctors.length) {
      endIndex = this.doctors.length;
    }
    this.dataSource.data = this.doctors.slice(startIndex, endIndex);
  }

  viewMedicalConsultation(id: any): void {
    this.medicalConsultationService.getMedicalConsultationByDoctorId(id).subscribe(data => {
      this.medicalConsultations = data;
      this.showMedicalConsultation = true;
    });
  }

}
