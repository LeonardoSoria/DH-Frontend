import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Doctor} from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl: string = environment.apiUrl;
  private baseUrl = `${this.apiUrl}`;

  constructor(private  http: HttpClient) { }

  getAllDoctors(): Observable<any> {
    return this.http.get<Doctor>(`${this.baseUrl}/getAllDoctors`);
  }

  getDoctorById(doctorId: number): Observable<any> {
    return this.http.get<Doctor>(`${this.baseUrl}/getDoctor/${doctorId}`);
  }

  saveDoctor(doctor: Doctor): Observable<any> {
    return this.http.post<Doctor>(`${this.baseUrl}/createDoctor`, doctor);
  }

  updateDoctor(doctor: Doctor): Observable<any> {
    return this.http.put<Doctor>(`${this.baseUrl}/updateDoctor`, doctor);
  }

  deleteDoctor(doctorId: number): Observable<any> {
    const url = `${this.baseUrl}/${doctorId}`;
    return this.http.delete<Doctor>(url);
  }

  getDeleteDoctorUrl(doctorId: number): string {
    const url = `${this.baseUrl}/deleteDoctor/${doctorId}`;
    return url;
  }
}
