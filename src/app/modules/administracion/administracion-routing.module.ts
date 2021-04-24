import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientComponent} from './components/patient/patient.component';
import {DoctorComponent} from './components/doctor/doctor.component';

const routes: Routes = [
  {
    path: 'pacientes',
    component: PatientComponent
  },
  {
    path: 'doctores',
    component: DoctorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
