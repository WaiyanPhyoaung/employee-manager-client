import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private serverUrl = 'http://localhost:8080/api/v1/employee';

  constructor(private http: HttpClient) {}

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.serverUrl}`);
  }
  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.serverUrl}`, employee);
  }
  public updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.serverUrl}/${id}`, employee);
  }
  public deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}/${id}`);
  }
}
