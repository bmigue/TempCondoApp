import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProperty } from '../property.model';
import { PropertyService } from '../service/property.service';

@Component({
  templateUrl: './property-delete-dialog.component.html',
})
export class PropertyDeleteDialogComponent {
  property?: IProperty;

  constructor(protected propertyService: PropertyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.propertyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
