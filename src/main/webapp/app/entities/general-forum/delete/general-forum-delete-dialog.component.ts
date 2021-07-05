import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGeneralForum } from '../general-forum.model';
import { GeneralForumService } from '../service/general-forum.service';

@Component({
  templateUrl: './general-forum-delete-dialog.component.html',
})
export class GeneralForumDeleteDialogComponent {
  generalForum?: IGeneralForum;

  constructor(protected generalForumService: GeneralForumService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.generalForumService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
