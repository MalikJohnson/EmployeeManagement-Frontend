import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal

@Component({
  selector: 'app-root',
  standalone: true, // Enable standalone mode
  imports: [RouterOutlet, CommonModule, FormsModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee | null = null; // Use null for editEmployee
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
    private modalService: NgbModal 
  ) {}

  ngOnInit(): void {
    this.getEmployees();
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

  public onAddEmloyee(addForm: NgForm): void {
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        this.getEmployees(); // Refresh the employee list
        addForm.reset(); // Reset the form
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset(); // Reset the form on error
      }
    });
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        this.getEmployees(); // Refresh the employee list
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteEmloyee(employeeId: number | undefined): void {
    // Check if employeeId is undefined
    if (employeeId === undefined) {
      alert('Employee ID is missing. Please try again.');
      return;
    }
  
    // Call the deleteEmployee method from the service
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: void) => {
        this.getEmployees(); // Refresh the employee list
      },
      error: (error: HttpErrorResponse) => {
        // Display error message
        if (error.status === 404) {
          alert('Employee not found. Please refresh the list and try again.');
        } else if (error.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert('An unexpected error occurred. Please check the console for details.');
        }
      }
    });
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (
        employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees(); // Reset the list if no results or empty search
    }
  }

  public onOpenModal(employee: Employee | null, mode: string, content: any): void {
    if (mode === 'add') {
      this.modalService.open(content, { ariaLabelledBy: 'addEmployeeModalLabel' });
    } else if (mode === 'edit' && employee) {
      this.tempEmployee = { ...employee }; // Copy employee data to tempEmployee
      this.modalService.open(content, { ariaLabelledBy: 'updateEmployeeModalLabel' });
    } else if (mode === 'delete' && employee) {
      this.deleteEmployee = employee;
      this.modalService.open(content, { ariaLabelledBy: 'deleteEmployeeModalLabel' });
    }
  }
}