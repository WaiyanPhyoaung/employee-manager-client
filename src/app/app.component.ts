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
  copyLists: Employee[] = [];

  form: FormGroup;
  searchForm: FormGroup;
  modal: any;
  deleteModal: any;
  idToDelete? = 0;

  constructor(private service: EmployeeService, builder: FormBuilder) {
    (this.form = builder.group({
      id: null,
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      jobTitles: ['', Validators.required],
      imageUrl: ['', Validators.required],
      employeeCode: null,
    })),
      (this.searchForm = builder.group({
        search: [''],
      }));
  }

  ngAfterViewInit(): void {
    this.modal = new bootstrap.Modal('#createModal');
    this.deleteModal = new bootstrap.Modal('#deleteModal');
  }

  ngOnInit(): void {
    this.getEmployees();

    this.searchForm.get('search')?.valueChanges.subscribe((value) => {
      this.employeeLists = this.searchAndUpdate(value, this.copyLists);
      if (this.employeeLists.length < 1 || !value) this.getEmployees();
    });
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
  getEmployees() {
    this.service.getEmployees().subscribe(
      (data) => {
        this.employeeLists = data;
        this.copyLists = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.error);
      }
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

  private searchAndUpdate(value: String, orignalLists: Employee[]) {
    if (orignalLists.length < 1) return [];

    let searchedEmployees: Employee[] = [];
    orignalLists.forEach((e) => {
      if (
        e.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        e.phoneNumber.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        e.email.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        e.jobTitles.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      )
        searchedEmployees.push(e);
    });
    return searchedEmployees;
  }
}
