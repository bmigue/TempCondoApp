import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GuestComponent } from './list/guest.component';
import { GuestDetailComponent } from './detail/guest-detail.component';
import { GuestUpdateComponent } from './update/guest-update.component';
import { GuestDeleteDialogComponent } from './delete/guest-delete-dialog.component';
import { GuestRoutingModule } from './route/guest-routing.module';

@NgModule({
  imports: [SharedModule, GuestRoutingModule],
  declarations: [GuestComponent, GuestDetailComponent, GuestUpdateComponent, GuestDeleteDialogComponent],
  entryComponents: [GuestDeleteDialogComponent],
})
export class GuestModule {}
