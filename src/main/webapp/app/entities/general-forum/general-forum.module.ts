import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GeneralForumComponent } from './list/general-forum.component';
import { GeneralForumDetailComponent } from './detail/general-forum-detail.component';
import { GeneralForumUpdateComponent } from './update/general-forum-update.component';
import { GeneralForumDeleteDialogComponent } from './delete/general-forum-delete-dialog.component';
import { GeneralForumRoutingModule } from './route/general-forum-routing.module';

@NgModule({
  imports: [SharedModule, GeneralForumRoutingModule],
  declarations: [GeneralForumComponent, GeneralForumDetailComponent, GeneralForumUpdateComponent, GeneralForumDeleteDialogComponent],
  entryComponents: [GeneralForumDeleteDialogComponent],
})
export class GeneralForumModule {}
