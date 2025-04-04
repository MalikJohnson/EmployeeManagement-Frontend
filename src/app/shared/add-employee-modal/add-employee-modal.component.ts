import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.css']
})
export class AddEmployeeModalComponent {
  employee: Employee = {
    id: null,
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    imageUrl: '',
    employeeCode: ''
  };

  constructor(
    public activeModal: NgbActiveModal,
    private employeeService: EmployeeService
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Submitting:', JSON.stringify(this.employee));
      this.employeeService.addEmployee(this.employee).subscribe({
        next: () => {
          this.activeModal.close(true);
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          alert('Failed to add employee: ' + error.message);
          this.activeModal.close(false);
        }
      });
    }
  }
}