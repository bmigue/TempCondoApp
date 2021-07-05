import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdminWall } from '../admin-wall.model';
import { AdminWallService } from '../service/admin-wall.service';

@Component({
  templateUrl: './admin-wall-delete-dialog.component.html',
})
export class AdminWallDeleteDialogComponent {
  adminWall?: IAdminWall;

  constructor(protected adminWallService: AdminWallService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.adminWallService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
