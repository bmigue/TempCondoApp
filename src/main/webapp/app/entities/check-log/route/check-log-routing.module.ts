import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CheckLogComponent } from '../list/check-log.component';
import { CheckLogDetailComponent } from '../detail/check-log-detail.component';
import { CheckLogUpdateComponent } from '../update/check-log-update.component';
import { CheckLogRoutingResolveService } from './check-log-routing-resolve.service';

const checkLogRoute: Routes = [
  {
    path: '',
    component: CheckLogComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckLogDetailComponent,
    resolve: {
      checkLog: CheckLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckLogUpdateComponent,
    resolve: {
      checkLog: CheckLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckLogUpdateComponent,
    resolve: {
      checkLog: CheckLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(checkLogRoute)],
  exports: [RouterModule],
})
export class CheckLogRoutingModule {}
