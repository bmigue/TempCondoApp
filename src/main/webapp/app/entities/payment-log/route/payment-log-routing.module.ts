import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PaymentLogComponent } from '../list/payment-log.component';
import { PaymentLogDetailComponent } from '../detail/payment-log-detail.component';
import { PaymentLogUpdateComponent } from '../update/payment-log-update.component';
import { PaymentLogRoutingResolveService } from './payment-log-routing-resolve.service';

const paymentLogRoute: Routes = [
  {
    path: '',
    component: PaymentLogComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentLogDetailComponent,
    resolve: {
      paymentLog: PaymentLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentLogUpdateComponent,
    resolve: {
      paymentLog: PaymentLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentLogUpdateComponent,
    resolve: {
      paymentLog: PaymentLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentLogRoute)],
  exports: [RouterModule],
})
export class PaymentLogRoutingModule {}
