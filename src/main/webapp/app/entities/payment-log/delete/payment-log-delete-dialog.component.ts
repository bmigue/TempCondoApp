import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentLog } from '../payment-log.model';
import { PaymentLogService } from '../service/payment-log.service';

@Component({
  templateUrl: './payment-log-delete-dialog.component.html',
})
export class PaymentLogDeleteDialogComponent {
  paymentLog?: IPaymentLog;

  constructor(protected paymentLogService: PaymentLogService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentLogService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
