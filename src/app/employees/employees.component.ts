import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeModalComponent } from '../shared/add-employee-modal/add-employee-modal.component';
import { EditEmployeeModalComponent } from '../shared/edit-employee-modal/edit-employee-modal.component';
import { DeleteEmployeeModalComponent } from '../shared/delete-employee-modal/delete-employee-modal.component';
import { EmployeeRefreshService } from '../shared-employee.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  public employees: Employee[] = [];
  private refreshSub!: Subscription;
  public tempEmployee: Employee = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    imageUrl: '',
    employeeCode: '',
  };
  public deleteEmployee: Employee | null = null;
  public searchKey: string = '';

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private refreshService: EmployeeRefreshService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.refreshSub = this.refreshService.refresh$.subscribe(() => {
      this.getEmployees();
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (
        employee.name.toLowerCase().includes(key.toLowerCase()) ||
        employee.email.toLowerCase().includes(key.toLowerCase()) ||
        employee.phone.toLowerCase().includes(key.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(key.toLowerCase())
      ) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public openAddModal(): void {
    const modalRef = this.modalService.open(AddEmployeeModalComponent);
    modalRef.result.then((result) => {
      if (result) { 
        this.getEmployees(); 
      }
    }).catch(() => {
     
      console.log('Modal dismissed');
    });
  }

  public openEditModal(employee: Employee): void {
    const modalRef = this.modalService.open(EditEmployeeModalComponent);
    modalRef.componentInstance.employee = { ...employee };
    modalRef.result.then((result) => {
      if (result) {
        this.getEmployees();
      }
    }).catch(() => {
      console.log('Modal dismissed');
    });
  }

  public openDeleteModal(employee: Employee): void {
  const modalRef = this.modalService.open(DeleteEmployeeModalComponent);
  modalRef.componentInstance.employee = employee;
  modalRef.result.then((result) => {
    if (result) {
      this.getEmployees();
    }
  }).catch(() => {
    console.log('Modal dismissed');
  });
}
}