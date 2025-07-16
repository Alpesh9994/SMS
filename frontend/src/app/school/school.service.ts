import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface School {
  id: string;
  name: string;
  address: string;
  logo?: string;
  adminEmail: string;
  config?: any;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private apiUrl = 'http://localhost:3000/api/tenant';

  constructor(private http: HttpClient) {}

  getSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.apiUrl);
  }

  addSchool(school: Partial<School>): Observable<School> {
    return this.http.post<School>(this.apiUrl, school);
  }

  editSchool(id: string, school: Partial<School>): Observable<School> {
    return this.http.patch<School>(`${this.apiUrl}/${id}`, school);
  }

  deleteSchool(id: string): Observable<School> {
    return this.http.delete<School>(`${this.apiUrl}/${id}`);
  }
} 