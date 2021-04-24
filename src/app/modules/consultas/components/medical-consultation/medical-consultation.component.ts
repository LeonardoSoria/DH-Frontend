import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../../../ng-alerts/alert.service';
import {PageEvent} from '@angular/material/paginator';
import {DeleteDialogComponent} from '../../../../components/delete-dialog/delete-dialog.component';
import {MedicalConsultation} from '../../interface/medicalConsultation.interface';
import {MedicalConsultationService} from '../../services/medical-consultation.service';
import {Patient} from '../../../administracion/interfaces/patient.interface';
import {Doctor} from '../../../administracion/interfaces/doctor.interface';
import {PatientService} from '../../../administracion/services/patient.service';
import {DoctorService} from '../../../administracion/services/doctor.service';

@Component({
  selector: 'app-medical-consultation',
  templateUrl: './medical-consultation.component.html',
  styleUrls: ['./medical-consultation.component.css']
})
export class MedicalConsultationComponent implements OnInit {

  medicalConsultation: MedicalConsultation | undefined;
  medicalConsultations: MedicalConsultation[] = [];
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  dataSource = new MatTableDataSource<MedicalConsultation>();
  displayedColumns: string[] = ['description', 'prescription', 'date', 'patient', 'doctor'];
  @ViewChild(MatSort) sort = new MatSort();
  medicalConsultationCant = 5;
  value = '';
  spinner = false;
  isFormActive = false;
  isEditing = false;
  medicalConsultationForm: FormGroup = new FormGroup({});

  constructor(private medicalConsultationService: MedicalConsultationService,
              private patientService: PatientService,
              private doctorService: DoctorService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loadMedicalConsultations();
    this.loadDoctors();
    this.loadPatients();
  }

  loadMedicalConsultations(): void {
    this.spinner = true;
    this.medicalConsultationService.getAllMedicalConsultations().subscribe(data => {
      this.medicalConsultations = data;
      this.dataSource.data = this.medicalConsultations.slice(0, 5);
      this.spinner = false;
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe(data => {
      this.patients = data;
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  createMedicalConsultationForm(medicalConsultation: any): void {
    this.medicalConsultationForm = this.formBuilder.group({
      id: new FormControl((medicalConsultation) ? medicalConsultation.id : 0, [Validators.required]),
      description: new FormControl((medicalConsultation) ? medicalConsultation.description : '', [Validators.required]),
      prescription: new FormControl((medicalConsultation) ? medicalConsultation.prescription : '', [Validators.required]),
      date: new FormControl((medicalConsultation) ? medicalConsultation.date : '', [Validators.required]),
      patientId: new FormControl((medicalConsultation) ? medicalConsultation.patient.id + '' : '', [Validators.required]),
      doctorId: new FormControl((medicalConsultation) ? medicalConsultation.doctor.id + ''  : '', [Validators.required])
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.medicalConsultations.length) {
      endIndex = this.medicalConsultations.length;
    }
    this.dataSource.data = this.medicalConsultations.slice(startIndex, endIndex);
  }

  addMedicalConsultation(): void {
    this.createMedicalConsultationForm(undefined);
    this.isFormActive = true;
    this.isEditing = false;
    this.medicalConsultation = undefined;
  }

  editMedicalConsultation(selectedMedicalConsultation: MedicalConsultation): void {
    this.medicalConsultation = selectedMedicalConsultation;
    this.createMedicalConsultationForm(this.medicalConsultation);
    this.isFormActive = true;
    this.isEditing = true;
  }

  deleteMedicalConsultation(selectedMedicalConsultation: MedicalConsultation): void {
    this.medicalConsultation = selectedMedicalConsultation;
    this.isFormActive = false;
    this.isEditing = false;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: `Eliminar Consulta Médica`,
        description: `¿ Esta Seguro de eliminar la consulta medica?`,
        url: this.medicalConsultationService.getDeleteMedicalConsultationUrl(this.medicalConsultation.id)
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (this.medicalConsultation && res === undefined) {
        const index = this.medicalConsultations.indexOf(this.medicalConsultation);
        this.medicalConsultations.splice(index, 1);
        this.dataSource.data = this.medicalConsultations.slice(0, this.medicalConsultationCant);
      }
    });
  }

  onSubmit(): void {
    this.spinner = true;
    if (this.medicalConsultationForm.status === 'INVALID') {
      this.spinner = false;
      this.alertService.error('Complete todos los campos obligatorios', 'Formulario');
      return;
    }

    if (!this.isEditing) {
      this.saveMedicalConsultation(this.medicalConsultationForm.value);
    } else {
      this.updateMedicalConsultation(this.medicalConsultationForm.value);
    }
  }

  backToList(): void {
    this.isFormActive = false;
    this.dataSource.data = this.medicalConsultations.slice(0, this.medicalConsultationCant);
  }

  saveMedicalConsultation(medicalConsultation: MedicalConsultation): void {
    this.medicalConsultationService.saveMedicalConsultation(medicalConsultation).subscribe(data => {
      this.medicalConsultation = data;
      this.alertService.success('Registro realizado correctamente!', '');
      this.spinner = false;
      this.isFormActive = false;
      this.loadMedicalConsultations();
    });
  }

  updateMedicalConsultation(medicalConsultation: MedicalConsultation): void {
    this.medicalConsultationService.updateMedicalConsultation(medicalConsultation).subscribe(data => {
      if (this.medicalConsultation) {
        const index = this.medicalConsultations.indexOf(this.medicalConsultation);
        this.medicalConsultations.splice(index, 1, data);
        this.dataSource.data = this.medicalConsultations.slice(0, this.medicalConsultationCant);
      }
      this.medicalConsultation = data;
      this.alertService.success('Registro actualizado correctamente!', '');
      this.spinner = false;
      this.isFormActive = false;
    });
  }

}
