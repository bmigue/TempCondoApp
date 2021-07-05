import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISysLog } from '../sys-log.model';
import { SysLogService } from '../service/sys-log.service';

@Component({
  templateUrl: './sys-log-delete-dialog.component.html',
})
export class SysLogDeleteDialogComponent {
  sysLog?: ISysLog;

  constructor(protected sysLogService: SysLogService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sysLogService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
