import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentLog } from '../payment-log.model';
import { PaymentLogService } from '../service/payment-log.service';
import { PaymentLogDeleteDialogComponent } from '../delete/payment-log-delete-dialog.component';

@Component({
  selector: 'jhi-payment-log',
  templateUrl: './payment-log.component.html',
})
export class PaymentLogComponent implements OnInit {
  paymentLogs?: IPaymentLog[];
  isLoading = false;

  constructor(protected paymentLogService: PaymentLogService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.paymentLogService.query().subscribe(
      (res: HttpResponse<IPaymentLog[]>) => {
        this.isLoading = false;
        this.paymentLogs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPaymentLog): number {
    return item.id!;
  }

  delete(paymentLog: IPaymentLog): void {
    const modalRef = this.modalService.open(PaymentLogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.paymentLog = paymentLog;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
