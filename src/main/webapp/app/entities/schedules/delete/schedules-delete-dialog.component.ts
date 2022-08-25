import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISchedules } from '../schedules.model';
import { SchedulesService } from '../service/schedules.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './schedules-delete-dialog.component.html',
})
export class SchedulesDeleteDialogComponent {
  schedules?: ISchedules;

  constructor(protected schedulesService: SchedulesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.schedulesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
