import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    this.getEmployees();
  }
  constructor(private employeeSerivce: EmployeeService){}
  public employees: Employee[] = [];

  public getEmployees(): void {
  this.employeeSerivce.getEmployees().subscribe(
    (response: Employee[]) => {
      this.employees = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
  }
}
