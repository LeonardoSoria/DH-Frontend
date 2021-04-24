import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MedicalConsultationComponent} from './components/medical-consultation/medical-consultation.component';
import {MedicalConsultationPatientsComponent} from './components/medical-consultation-patients/medical-consultation-patients.component';
import {MedicalConsultationDoctorsComponent} from './components/medical-consultation-doctors/medical-consultation-doctors.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalConsultationComponent
  },
  {
    path: 'consultas-pacientes',
    component: MedicalConsultationPatientsComponent
  },
  {
    path: 'consultas-doctores',
    component: MedicalConsultationDoctorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
