import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICondo } from '../condo.model';
import { CondoService } from '../service/condo.service';

@Component({
  templateUrl: './condo-delete-dialog.component.html',
})
export class CondoDeleteDialogComponent {
  condo?: ICondo;

  constructor(protected condoService: CondoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.condoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
