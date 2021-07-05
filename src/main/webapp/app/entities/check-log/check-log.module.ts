import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CheckLogComponent } from './list/check-log.component';
import { CheckLogDetailComponent } from './detail/check-log-detail.component';
import { CheckLogUpdateComponent } from './update/check-log-update.component';
import { CheckLogDeleteDialogComponent } from './delete/check-log-delete-dialog.component';
import { CheckLogRoutingModule } from './route/check-log-routing.module';

@NgModule({
  imports: [SharedModule, CheckLogRoutingModule],
  declarations: [CheckLogComponent, CheckLogDetailComponent, CheckLogUpdateComponent, CheckLogDeleteDialogComponent],
  entryComponents: [CheckLogDeleteDialogComponent],
})
export class CheckLogModule {}
