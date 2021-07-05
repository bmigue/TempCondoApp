import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExceptionTable } from '../exception-table.model';
import { ExceptionTableService } from '../service/exception-table.service';

@Component({
  templateUrl: './exception-table-delete-dialog.component.html',
})
export class ExceptionTableDeleteDialogComponent {
  exceptionTable?: IExceptionTable;

  constructor(protected exceptionTableService: ExceptionTableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exceptionTableService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
