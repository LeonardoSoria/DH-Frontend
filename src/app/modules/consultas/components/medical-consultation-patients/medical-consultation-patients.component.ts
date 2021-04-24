import {Component, OnInit, ViewChild} from '@angular/core';
import {MedicalConsultation} from '../../interface/medicalConsultation.interface';
import {Patient} from '../../../administracion/interfaces/patient.interface';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MedicalConsultationService} from '../../services/medical-consultation.service';
import {PatientService} from '../../../administracion/services/patient.service';
import {AlertService} from '../../../../ng-alerts/alert.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-medical-consultation-patients',
  templateUrl: './medical-consultation-patients.component.html',
  styleUrls: ['./medical-consultation-patients.component.css']
})
export class MedicalConsultationPatientsComponent implements OnInit {

  medicalConsultations: MedicalConsultation[] = [];
  patients: Patient[] = [];
  dataSource = new MatTableDataSource<Patient>();
  displayedColumns: string[] = ['name', 'lastname', 'birthdate', 'address', 'actions'];
  @ViewChild(MatSort) sort = new MatSort();
  medicalConsultationsCant = 5;
  patientsCant = 5;
  value = '';
  showMedicalConsultation = false;
  spinner = false;

  constructor(private medicalConsultationService: MedicalConsultationService,
              private patientService: PatientService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe(data => {
      this.patients = data;
      this.dataSource.data = this.patients.slice(0, 5);
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
    if (endIndex > this.patients.length) {
      endIndex = this.patients.length;
    }
    this.dataSource.data = this.patients.slice(startIndex, endIndex);
  }

  viewMedicalConsultation(id: any): void {
    this.medicalConsultationService.getMedicalConsultationByPatientId(id).subscribe(data => {
      this.medicalConsultations = data;
      this.showMedicalConsultation = true;
    });
  }

}
