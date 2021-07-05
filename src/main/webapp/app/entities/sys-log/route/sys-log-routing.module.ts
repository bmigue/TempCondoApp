import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SysLogComponent } from '../list/sys-log.component';
import { SysLogDetailComponent } from '../detail/sys-log-detail.component';
import { SysLogUpdateComponent } from '../update/sys-log-update.component';
import { SysLogRoutingResolveService } from './sys-log-routing-resolve.service';

const sysLogRoute: Routes = [
  {
    path: '',
    component: SysLogComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SysLogDetailComponent,
    resolve: {
      sysLog: SysLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SysLogUpdateComponent,
    resolve: {
      sysLog: SysLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SysLogUpdateComponent,
    resolve: {
      sysLog: SysLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sysLogRoute)],
  exports: [RouterModule],
})
export class SysLogRoutingModule {}
