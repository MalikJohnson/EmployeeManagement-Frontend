import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm

@Component({
  selector: 'app-root',
  standalone: true, // Enable standalone mode
  imports: [RouterOutlet, CommonModule, FormsModule], // Add FormsModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee | null = null; // Add editEmployee property
  public deleteEmployee: Employee | null = null; // Add deleteEmployee property
  public searchKey: string = ''; 

  constructor(private employeeService: EmployeeService) {}

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
    document.getElementById('add-employee-form')?.click(); // Close the modal
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        console.log(response);
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
        console.log(response);
        this.getEmployees(); // Refresh the employee list
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteEmloyee(employeeId: number | undefined): void {
    if (employeeId === undefined) {
      console.error('Employee ID is undefined');
      return;
    }
  
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getEmployees(); // Refresh the employee list
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchEmployees(key: string): void {
    console.log(key);
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

  public onOpenModal(employee: Employee | null, mode: string): void {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    } else if (mode === 'edit' && employee) {
      this.editEmployee = employee; // Set the employee to edit
      button.setAttribute('data-target', '#updateEmployeeModal');
    } else if (mode === 'delete' && employee) {
      this.deleteEmployee = employee; // Set the employee to delete
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    document.body.appendChild(button);
    button.click();
  }
}