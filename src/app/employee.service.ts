import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Employee } from "./employee";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiServerUrl = environment.apiUrl; 

    //inject HttpClient
    constructor(private http: HttpClient) { } 

    //return all employees
    public getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`);
    }

    //return single employee
    public addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee);
    }

    //update single employee
    public updateEmployee(employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee);
    }

    //delete single employee
    public deleteEmployee(employeeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${employeeId}`);
    }
}