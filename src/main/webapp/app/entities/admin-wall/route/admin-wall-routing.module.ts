import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdminWallComponent } from '../list/admin-wall.component';
import { AdminWallDetailComponent } from '../detail/admin-wall-detail.component';
import { AdminWallUpdateComponent } from '../update/admin-wall-update.component';
import { AdminWallRoutingResolveService } from './admin-wall-routing-resolve.service';

const adminWallRoute: Routes = [
  {
    path: '',
    component: AdminWallComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdminWallDetailComponent,
    resolve: {
      adminWall: AdminWallRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdminWallUpdateComponent,
    resolve: {
      adminWall: AdminWallRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdminWallUpdateComponent,
    resolve: {
      adminWall: AdminWallRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminWallRoute)],
  exports: [RouterModule],
})
export class AdminWallRoutingModule {}
