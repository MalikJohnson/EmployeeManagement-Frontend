import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee-modal.component.html'
})
export class EditEmployeeModalComponent {
  @Input() employee!: Employee;

  constructor(
    public activeModal: NgbActiveModal,
    private employeeService: EmployeeService
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: () => {
          this.activeModal.close(true);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.activeModal.close(false);
        }
      });
    }
  }
}