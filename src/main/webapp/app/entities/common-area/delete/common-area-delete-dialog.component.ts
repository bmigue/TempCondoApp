import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommonArea } from '../common-area.model';
import { CommonAreaService } from '../service/common-area.service';

@Component({
  templateUrl: './common-area-delete-dialog.component.html',
})
export class CommonAreaDeleteDialogComponent {
  commonArea?: ICommonArea;

  constructor(protected commonAreaService: CommonAreaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commonAreaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
