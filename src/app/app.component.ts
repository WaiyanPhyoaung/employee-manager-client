import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  modalHeader = '';
  title = 'employee-manager';
  employeeLists: Employee[] = [];
  form: FormGroup;
  modal: any;
  deleteModal: any;
  idToDelete? = 0;
  employee: Employee = {
    name: '',
    email: '',
    jobTitles: '',
    imageUrl: '',
    phoneNumber: '',
  };

  constructor(private service: EmployeeService, builder: FormBuilder) {
    this.form = builder.group({
      id: null,
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      jobTitles: ['', Validators.required],
      imageUrl: ['', Validators.required],
      employeeCode: null,
    });
  }
  ngAfterViewInit(): void {
    this.modal = new bootstrap.Modal('#createModal');
    this.deleteModal = new bootstrap.Modal('#deleteModal');
  }

  ngOnInit(): void {
    this.getEmployees();
  }
  openCreateModal() {
    this.modalHeader = 'Create Employee';
    this.form.reset();
    this.modal.show();
  }
  openEditModal(employee: Employee) {
    console.log(employee);
    this.modalHeader = 'Edit Employee';
    this.form.patchValue(employee);
    this.modal.show();
  }
  openDeleteModal(id?: number) {
    this.deleteModal.show();
    console.log(id);
    this.idToDelete = id;
  }
  save = () => {
    if (this.form.get('id')?.value) {
      const id = this.form.get('id')!.value;
      this.updateEmployee(id, this.form.value);
    } else this.createEmployee(this.form.value);

    this.modal.hide();
  };
  delete = () => {
    console.log(this.idToDelete);
    this.service.deleteEmployee(this.idToDelete!).subscribe(
      (data) => {
        console.log('Deleted Successfully');
        this.idToDelete = 0;
        this.getEmployees();
      },
      (error) => console.log('Error on delete' + error.message)
    );
    this.deleteModal.hide();
  };
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

  createEmployee(employee: Employee) {
    this.service.addEmployee(employee).subscribe(
      (data) => {
        this.getEmployees();
      },
      (error) => console.log('Error happes' + error.message)
    );
  }
  updateEmployee(id: number, employee: Employee) {
    this.service.updateEmployee(id, employee).subscribe(
      (data) => {
        this.getEmployees();
      },
      (error) => console.log(error)
    );
  }
}
