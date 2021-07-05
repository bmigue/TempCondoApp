import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGuest } from '../guest.model';
import { GuestService } from '../service/guest.service';

@Component({
  templateUrl: './guest-delete-dialog.component.html',
})
export class GuestDeleteDialogComponent {
  guest?: IGuest;

  constructor(protected guestService: GuestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.guestService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
