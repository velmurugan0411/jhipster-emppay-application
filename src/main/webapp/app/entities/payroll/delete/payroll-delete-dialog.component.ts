import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPayroll } from '../payroll.model';
import { PayrollService } from '../service/payroll.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './payroll-delete-dialog.component.html',
})
export class PayrollDeleteDialogComponent {
  payroll?: IPayroll;

  constructor(protected payrollService: PayrollService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.payrollService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
