import {Component, OnInit, ViewChild} from '@angular/core';
import {Patient} from '../../interfaces/patient.interface';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {PatientService} from '../../services/patient.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {DeleteDialogComponent} from '../../../../components/delete-dialog/delete-dialog.component';
import {AlertService} from '../../../../ng-alerts/alert.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  patient: Patient | undefined;
  patients: Patient[] = [];
  dataSource = new MatTableDataSource<Patient>();
  displayedColumns: string[] = ['name', 'lastname', 'birthdate', 'address', 'actions'];
  @ViewChild(MatSort) sort = new MatSort();
  patientsCant = 5;
  value = '';
  spinner = false;
  isFormActive = false;
  isEditing = false;
  patientForm: FormGroup = new FormGroup({});

  constructor(private patientService: PatientService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.spinner = true;
    this.patientService.getAllPatients().subscribe(data => {
      this.patients = data;
      this.dataSource.data = this.patients.slice(0, 5);
      this.spinner = false;
    });
  }

  createPatientForm(patient: any): void {
    this.patientForm = this.formBuilder.group({
      id: new FormControl((patient) ? patient.id : 0, [Validators.required]),
      name: new FormControl((patient) ? patient.name : '', [Validators.required]),
      lastname: new FormControl((patient) ? patient.lastname : '', [Validators.required]),
      birthdate: new FormControl((patient) ? patient.birthdate : '', [Validators.required]),
      address: new FormControl((patient) ? patient.address : '', [Validators.required])
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

  addPatient(): void {
    this.createPatientForm(undefined);
    this.isFormActive = true;
    this.isEditing = false;
    this.patient = undefined;
  }

  editPatient(selectedPatient: Patient): void {
    this.patient = selectedPatient;
    this.createPatientForm(this.patient);
    this.isFormActive = true;
    this.isEditing = true;
  }

  deletePatient(selectedPatient: Patient): void {
    this.patient = selectedPatient;
    this.isFormActive = false;
    this.isEditing = false;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: `Eliminar Paciente`,
        description: `¿ Esta Seguro de eliminar el paciente ${this.patient.name} ?`,
        url: this.patientService.getDeletePatientUrl(this.patient.id)
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (this.patient && res === undefined) {
        const index = this.patients.indexOf(this.patient);
        this.patients.splice(index, 1);
        this.dataSource.data = this.patients.slice(0, this.patientsCant);
      }
    });
  }

  onSubmit(): void {
    this.spinner = true;
    if (this.patientForm.status === 'INVALID') {
      this.spinner = false;
      this.alertService.error('Complete todos los campos obligatorios', 'Formulario');
      return;
    }

    if (!this.isEditing) {
      this.savePatient(this.patientForm.value);
    } else {
      this.updatePatient(this.patientForm.value);
    }
  }

  backToList(): void {
    this.isFormActive = false;
    this.dataSource.data = this.patients.slice(0, this.patientsCant);
  }

  savePatient(patient: Patient): void {
    this.patientService.savePatient(patient).subscribe(data => {
      this.patient = data;
      this.alertService.success('Registro realizado correctamente!', `Paciente: ${data.name}`);
      this.spinner = false;
      this.isFormActive = false;
      this.loadPatients();
    });
  }

  updatePatient(patient: Patient): void {
    this.patientService.updatePatient(patient).subscribe(data => {
      if (this.patient) {
        const index = this.patients.indexOf(this.patient);
        this.patients.splice(index, 1, data);
        this.dataSource.data = this.patients.slice(0, this.patientsCant);
      }
      this.patient = data;
      this.alertService.success('Registro actualizado correctamente!', `Paciente: ${data.name}`);
      this.spinner = false;
      this.isFormActive = false;
    });
  }
}
