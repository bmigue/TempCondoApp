import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommonAreaComponent } from './list/common-area.component';
import { CommonAreaDetailComponent } from './detail/common-area-detail.component';
import { CommonAreaUpdateComponent } from './update/common-area-update.component';
import { CommonAreaDeleteDialogComponent } from './delete/common-area-delete-dialog.component';
import { CommonAreaRoutingModule } from './route/common-area-routing.module';

@NgModule({
  imports: [SharedModule, CommonAreaRoutingModule],
  declarations: [CommonAreaComponent, CommonAreaDetailComponent, CommonAreaUpdateComponent, CommonAreaDeleteDialogComponent],
  entryComponents: [CommonAreaDeleteDialogComponent],
})
export class CommonAreaModule {}
