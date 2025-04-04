import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee-modal.component.html',
  styleUrls: ['./edit-employee-modal.component.css']
})
export class EditEmployeeModalComponent {
  @Input() employee!: Employee;

  // Avatar options 1-8
  avatarOptions = [
    { id: 1, url: 'https://bootdey.com/img/Content/avatar/avatar1.png' },
    { id: 2, url: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
    { id: 3, url: 'https://bootdey.com/img/Content/avatar/avatar3.png' },
    { id: 4, url: 'https://bootdey.com/img/Content/avatar/avatar4.png' },
    { id: 5, url: 'https://bootdey.com/img/Content/avatar/avatar5.png' },
    { id: 6, url: 'https://bootdey.com/img/Content/avatar/avatar6.png' },
    { id: 7, url: 'https://bootdey.com/img/Content/avatar/avatar7.png' },
    { id: 8, url: 'https://bootdey.com/img/Content/avatar/avatar8.png' }
  ];

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