import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SysLogComponent } from './list/sys-log.component';
import { SysLogDetailComponent } from './detail/sys-log-detail.component';
import { SysLogUpdateComponent } from './update/sys-log-update.component';
import { SysLogDeleteDialogComponent } from './delete/sys-log-delete-dialog.component';
import { SysLogRoutingModule } from './route/sys-log-routing.module';

@NgModule({
  imports: [SharedModule, SysLogRoutingModule],
  declarations: [SysLogComponent, SysLogDetailComponent, SysLogUpdateComponent, SysLogDeleteDialogComponent],
  entryComponents: [SysLogDeleteDialogComponent],
})
export class SysLogModule {}
