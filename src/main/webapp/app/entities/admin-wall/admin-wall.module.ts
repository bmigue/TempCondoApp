import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdminWallComponent } from './list/admin-wall.component';
import { AdminWallDetailComponent } from './detail/admin-wall-detail.component';
import { AdminWallUpdateComponent } from './update/admin-wall-update.component';
import { AdminWallDeleteDialogComponent } from './delete/admin-wall-delete-dialog.component';
import { AdminWallRoutingModule } from './route/admin-wall-routing.module';

@NgModule({
  imports: [SharedModule, AdminWallRoutingModule],
  declarations: [AdminWallComponent, AdminWallDetailComponent, AdminWallUpdateComponent, AdminWallDeleteDialogComponent],
  entryComponents: [AdminWallDeleteDialogComponent],
})
export class AdminWallModule {}
