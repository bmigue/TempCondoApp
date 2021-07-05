import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExceptionTableComponent } from '../list/exception-table.component';
import { ExceptionTableDetailComponent } from '../detail/exception-table-detail.component';
import { ExceptionTableUpdateComponent } from '../update/exception-table-update.component';
import { ExceptionTableRoutingResolveService } from './exception-table-routing-resolve.service';

const exceptionTableRoute: Routes = [
  {
    path: '',
    component: ExceptionTableComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExceptionTableDetailComponent,
    resolve: {
      exceptionTable: ExceptionTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExceptionTableUpdateComponent,
    resolve: {
      exceptionTable: ExceptionTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExceptionTableUpdateComponent,
    resolve: {
      exceptionTable: ExceptionTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exceptionTableRoute)],
  exports: [RouterModule],
})
export class ExceptionTableRoutingModule {}
