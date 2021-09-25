import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'employee-manager';
  employeeLists: Employee[] = [];

  constructor(private service: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.service.getEmployees().subscribe(
      (data) => {
        this.employeeLists = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.error);
      },
      () => console.log('Success')
    );
  }
}
