import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {MedicalConsultation} from '../interface/medicalConsultation.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicalConsultationService {

  private apiUrl: string = environment.apiUrl;
  private baseUrl = `${this.apiUrl}`;

  constructor(private  http: HttpClient) { }

  getAllMedicalConsultations(): Observable<any> {
    return this.http.get<MedicalConsultation>(`${this.baseUrl}/getAllMedicalConsultations`);
  }

  getMedicalConsultationById(medicalConsultationId: number): Observable<any> {
    return this.http.get<MedicalConsultation>(`${this.baseUrl}/getMedicalConsultation/${medicalConsultationId}`);
  }

  getMedicalConsultationByPatientId(patientId: number): Observable<any> {
    return this.http.get<MedicalConsultation>(`${this.baseUrl}/getMedicalConsultationByPatientId/${patientId}`);
  }

  getMedicalConsultationByDoctorId(doctorId: number): Observable<any> {
    return this.http.get<MedicalConsultation>(`${this.baseUrl}/getMedicalConsultationByDoctorId/${doctorId}`);
  }

  saveMedicalConsultation(medicalConsultation: MedicalConsultation): Observable<any> {
    return this.http.post<MedicalConsultation>(`${this.baseUrl}/createMedicalConsultation`, medicalConsultation);
  }

  updateMedicalConsultation(medicalConsultation: MedicalConsultation): Observable<any> {
    return this.http.put<MedicalConsultation>(`${this.baseUrl}/updateMedicalConsultation`, medicalConsultation);
  }

  deleteMedicalConsultation(medicalConsultationId: number): Observable<any> {
    const url = `${this.baseUrl}/${medicalConsultationId}`;
    return this.http.delete<MedicalConsultation>(url);
  }

  getDeleteMedicalConsultationUrl(medicalConsultationId: number): string {
    const url = `${this.baseUrl}/deleteMedicalConsultation/${medicalConsultationId}`;
    return url;
  }
}
