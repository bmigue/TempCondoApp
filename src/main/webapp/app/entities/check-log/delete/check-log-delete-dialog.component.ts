import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICheckLog } from '../check-log.model';
import { CheckLogService } from '../service/check-log.service';

@Component({
  templateUrl: './check-log-delete-dialog.component.html',
})
export class CheckLogDeleteDialogComponent {
  checkLog?: ICheckLog;

  constructor(protected checkLogService: CheckLogService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.checkLogService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
