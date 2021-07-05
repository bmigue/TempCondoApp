import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserInterface } from '../user-interface.model';
import { UserInterfaceService } from '../service/user-interface.service';

@Component({
  templateUrl: './user-interface-delete-dialog.component.html',
})
export class UserInterfaceDeleteDialogComponent {
  userInterface?: IUserInterface;

  constructor(protected userInterfaceService: UserInterfaceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userInterfaceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
