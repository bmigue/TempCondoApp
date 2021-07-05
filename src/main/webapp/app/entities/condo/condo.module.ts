import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CondoComponent } from './list/condo.component';
import { CondoDetailComponent } from './detail/condo-detail.component';
import { CondoUpdateComponent } from './update/condo-update.component';
import { CondoDeleteDialogComponent } from './delete/condo-delete-dialog.component';
import { CondoRoutingModule } from './route/condo-routing.module';

@NgModule({
  imports: [SharedModule, CondoRoutingModule],
  declarations: [CondoComponent, CondoDetailComponent, CondoUpdateComponent, CondoDeleteDialogComponent],
  entryComponents: [CondoDeleteDialogComponent],
})
export class CondoModule {}
