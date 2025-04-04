import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Employee } from "./employee";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiServerUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getAuthHeaders(): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getToken()}`
            })
        };
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }

    public getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`, this.getAuthHeaders())
            .pipe(catchError(this.handleError));
    }

    public getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiServerUrl}/employee/find/${id}`, this.getAuthHeaders())
            .pipe(catchError(this.handleError));
    }

    public addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee, this.getAuthHeaders())
            .pipe(catchError(this.handleError));
    }

    public updateEmployee(employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee, this.getAuthHeaders())
            .pipe(catchError(this.handleError));
    }

    public deleteEmployee(employeeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${employeeId}`, this.getAuthHeaders())
            .pipe(catchError(this.handleError));
    }
}