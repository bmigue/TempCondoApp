import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentLog } from '../payment-log.model';

@Component({
  selector: 'jhi-payment-log-detail',
  templateUrl: './payment-log-detail.component.html',
})
export class PaymentLogDetailComponent implements OnInit {
  paymentLog: IPaymentLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentLog }) => {
      this.paymentLog = paymentLog;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
