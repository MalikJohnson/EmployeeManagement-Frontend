import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-employee-modal.component.html'
})
export class DeleteEmployeeModalComponent {
  @Input() employee!: Employee;

  constructor(
    public activeModal: NgbActiveModal,
    private employeeService: EmployeeService
  ) {}

  confirmDelete(): void {
    if (this.employee.id) {
      this.employeeService.deleteEmployee(this.employee.id).subscribe({
        next: () => {
          this.activeModal.close(true);
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.activeModal.close(false);
        }
      });
    }
  }
}