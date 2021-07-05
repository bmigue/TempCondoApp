import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaymentLog, PaymentLog } from '../payment-log.model';
import { PaymentLogService } from '../service/payment-log.service';

@Injectable({ providedIn: 'root' })
export class PaymentLogRoutingResolveService implements Resolve<IPaymentLog> {
  constructor(protected service: PaymentLogService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentLog> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentLog: HttpResponse<PaymentLog>) => {
          if (paymentLog.body) {
            return of(paymentLog.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentLog());
  }
}
