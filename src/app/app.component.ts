import { Component, OnInit} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeModalComponent } from './shared/add-employee-modal/add-employee-modal.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeRefreshService } from './shared-employee.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee | null = null;
  public tempEmployee: Employee = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    imageUrl: '',
    employeeCode: ''
  };
  public deleteEmployee: Employee | null = null;
  public searchKey: string = '';

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    public authService: AuthService,
    private refreshService: EmployeeRefreshService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.getEmployees();
    }
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

  public onAddEmployee(addForm: NgForm): void {
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }

  /*public onUpdateEmployee(employee: Employee): void {
    if (employee.id) {
      this.employeeService.updateEmployee(employee).subscribe({
        next: (response: Employee) => {
          this.getEmployees();
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        }
      });
    }
  }*/

  public onDeleteEmployee(employeeId: number | undefined): void {
    if (employeeId === undefined) {
      alert('Employee ID is missing');
      return;
    }

    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          alert('Employee not found');
        } else if (error.status === 403) {
          alert('You can only delete your own employees');
        } else {
          alert('Error deleting employee');
        }
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

  public onOpenModal(employee: Employee | null, mode: string, content: any): void {
    if (mode === 'add') {
      this.modalService.open(content, { ariaLabelledBy: 'addEmployeeModalLabel' });
    } else if (mode === 'edit' && employee) {
      this.tempEmployee = { ...employee };
      this.modalService.open(content, { ariaLabelledBy: 'updateEmployeeModalLabel' });
    } else if (mode === 'delete' && employee) {
      this.deleteEmployee = employee;
      this.modalService.open(content, { ariaLabelledBy: 'deleteEmployeeModalLabel' });
    }
  }
  openAddModal() {
    const modalRef = this.modalService.open(AddEmployeeModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.refreshService.triggerRefresh();
      }
    });
  }
}