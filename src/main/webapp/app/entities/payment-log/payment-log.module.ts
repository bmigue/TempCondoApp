import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentLogComponent } from './list/payment-log.component';
import { PaymentLogDetailComponent } from './detail/payment-log-detail.component';
import { PaymentLogUpdateComponent } from './update/payment-log-update.component';
import { PaymentLogDeleteDialogComponent } from './delete/payment-log-delete-dialog.component';
import { PaymentLogRoutingModule } from './route/payment-log-routing.module';

@NgModule({
  imports: [SharedModule, PaymentLogRoutingModule],
  declarations: [PaymentLogComponent, PaymentLogDetailComponent, PaymentLogUpdateComponent, PaymentLogDeleteDialogComponent],
  entryComponents: [PaymentLogDeleteDialogComponent],
})
export class PaymentLogModule {}
