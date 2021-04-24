import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Doctor} from '../../interfaces/doctor.interface';
import {PatientService} from '../../services/patient.service';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../../../ng-alerts/alert.service';
import {PageEvent} from '@angular/material/paginator';
import {Patient} from '../../interfaces/patient.interface';
import {DeleteDialogComponent} from '../../../../components/delete-dialog/delete-dialog.component';
import {DoctorService} from '../../services/doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  doctor: Doctor | undefined;
  doctors: Doctor[] = [];
  dataSource = new MatTableDataSource<Doctor>();
  displayedColumns: string[] = ['name', 'lastname', 'birthdate', 'address', 'speciality', 'actions'];
  @ViewChild(MatSort) sort = new MatSort();
  doctorsCant = 5;
  value = '';
  spinner = false;
  isFormActive = false;
  isEditing = false;
  doctorForm: FormGroup = new FormGroup({});

  constructor(private doctorService: DoctorService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.spinner = true;
    this.doctorService.getAllDoctors().subscribe(data => {
      this.doctors = data;
      this.dataSource.data = this.doctors.slice(0, 5);
      this.spinner = false;
    });
  }

  createDoctorForm(doctor: any): void {
    this.doctorForm = this.formBuilder.group({
      id: new FormControl((doctor) ? doctor.id : 0, [Validators.required]),
      name: new FormControl((doctor) ? doctor.name : '', [Validators.required]),
      lastname: new FormControl((doctor) ? doctor.lastname : '', [Validators.required]),
      birthdate: new FormControl((doctor) ? doctor.birthdate : '', [Validators.required]),
      address: new FormControl((doctor) ? doctor.address : '', [Validators.required]),
      speciality: new FormControl((doctor) ? doctor.speciality : '', [Validators.required])
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

  addDoctor(): void {
    this.createDoctorForm(undefined);
    this.isFormActive = true;
    this.isEditing = false;
    this.doctor = undefined;
  }

  editDoctor(selectedDoctor: Doctor): void {
    this.doctor = selectedDoctor;
    this.createDoctorForm(this.doctor);
    this.isFormActive = true;
    this.isEditing = true;
  }

  deleteDoctor(selectedDoctor: Doctor): void {
    this.doctor = selectedDoctor;
    this.isFormActive = false;
    this.isEditing = false;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: `Eliminar Doctor`,
        description: `¿ Esta Seguro de eliminar el paciente ${this.doctor.name} ?`,
        url: this.doctorService.getDeleteDoctorUrl(this.doctor.id)
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (this.doctor && res === undefined) {
        const index = this.doctors.indexOf(this.doctor);
        this.doctors.splice(index, 1);
        this.dataSource.data = this.doctors.slice(0, this.doctorsCant);
      }
    });
  }

  onSubmit(): void {
    this.spinner = true;
    if (this.doctorForm.status === 'INVALID') {
      this.spinner = false;
      this.alertService.error('Complete todos los campos obligatorios', 'Formulario');
      return;
    }

    if (!this.isEditing) {
      this.saveDoctor(this.doctorForm.value);
    } else {
      this.updateDoctor(this.doctorForm.value);
    }
  }

  backToList(): void {
    this.isFormActive = false;
    this.dataSource.data = this.doctors.slice(0, this.doctorsCant);
  }

  saveDoctor(doctor: Doctor): void {
    this.doctorService.saveDoctor(doctor).subscribe(data => {
      this.doctor = data;
      this.alertService.success('Registro realizado correctamente!', `Doctor: ${data.name}`);
      this.spinner = false;
      this.isFormActive = false;
      this.loadDoctors();
    });
  }

  updateDoctor(doctor: Doctor): void {
    this.doctorService.updateDoctor(doctor).subscribe(data => {
      if (this.doctor) {
        const index = this.doctors.indexOf(this.doctor);
        this.doctors.splice(index, 1, data);
        this.dataSource.data = this.doctors.slice(0, this.doctorsCant);
      }
      this.doctor = data;
      this.alertService.success('Registro actualizado correctamente!', `Doctor: ${data.name}`);
      this.spinner = false;
      this.isFormActive = false;
    });
  }

}
