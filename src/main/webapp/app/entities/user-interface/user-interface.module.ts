import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserInterfaceComponent } from './list/user-interface.component';
import { UserInterfaceDetailComponent } from './detail/user-interface-detail.component';
import { UserInterfaceUpdateComponent } from './update/user-interface-update.component';
import { UserInterfaceDeleteDialogComponent } from './delete/user-interface-delete-dialog.component';
import { UserInterfaceRoutingModule } from './route/user-interface-routing.module';

@NgModule({
  imports: [SharedModule, UserInterfaceRoutingModule],
  declarations: [UserInterfaceComponent, UserInterfaceDetailComponent, UserInterfaceUpdateComponent, UserInterfaceDeleteDialogComponent],
  entryComponents: [UserInterfaceDeleteDialogComponent],
})
export class UserInterfaceModule {}
