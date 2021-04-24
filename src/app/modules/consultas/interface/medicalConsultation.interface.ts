import {Patient} from '../../administracion/interfaces/patient.interface';
import {Doctor} from '../../administracion/interfaces/doctor.interface';

export interface MedicalConsultation {
  id: number;
  description: string;
  date: string;
  prescription: string;
  patient: Patient;
  doctor: Doctor;
}
