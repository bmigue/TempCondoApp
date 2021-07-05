import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommonAreaComponent } from '../list/common-area.component';
import { CommonAreaDetailComponent } from '../detail/common-area-detail.component';
import { CommonAreaUpdateComponent } from '../update/common-area-update.component';
import { CommonAreaRoutingResolveService } from './common-area-routing-resolve.service';

const commonAreaRoute: Routes = [
  {
    path: '',
    component: CommonAreaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommonAreaDetailComponent,
    resolve: {
      commonArea: CommonAreaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommonAreaUpdateComponent,
    resolve: {
      commonArea: CommonAreaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommonAreaUpdateComponent,
    resolve: {
      commonArea: CommonAreaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commonAreaRoute)],
  exports: [RouterModule],
})
export class CommonAreaRoutingModule {}
