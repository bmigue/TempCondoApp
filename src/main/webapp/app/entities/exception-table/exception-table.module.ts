import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExceptionTableComponent } from './list/exception-table.component';
import { ExceptionTableDetailComponent } from './detail/exception-table-detail.component';
import { ExceptionTableUpdateComponent } from './update/exception-table-update.component';
import { ExceptionTableDeleteDialogComponent } from './delete/exception-table-delete-dialog.component';
import { ExceptionTableRoutingModule } from './route/exception-table-routing.module';

@NgModule({
  imports: [SharedModule, ExceptionTableRoutingModule],
  declarations: [
    ExceptionTableComponent,
    ExceptionTableDetailComponent,
    ExceptionTableUpdateComponent,
    ExceptionTableDeleteDialogComponent,
  ],
  entryComponents: [ExceptionTableDeleteDialogComponent],
})
export class ExceptionTableModule {}
