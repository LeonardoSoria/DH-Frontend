import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Patient} from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl: string = environment.apiUrl;
  private baseUrl = `${this.apiUrl}`;

  constructor(private  http: HttpClient) { }

  getAllPatients(): Observable<any> {
    return this.http.get<Patient>(`${this.baseUrl}/getAllPatients`);
  }

  getPatientById(patientId: number): Observable<any> {
    return this.http.get<Patient>(`${this.baseUrl}/getPatient/${patientId}`);
  }

  savePatient(patient: Patient): Observable<any> {
    return this.http.post<Patient>(`${this.baseUrl}/createPatient`, patient);
  }

  updatePatient(patient: Patient): Observable<any> {
    return this.http.put<Patient>(`${this.baseUrl}/updatePatient`, patient);
  }

  deletePatient(patientId: number): Observable<any> {
    const url = `${this.baseUrl}/${patientId}`;
    return this.http.delete<Patient>(url);
  }

  getDeletePatientUrl(patientId: number): string {
    const url = `${this.baseUrl}/deletePatient/${patientId}`;
    return url;
  }
}
