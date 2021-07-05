import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GuestComponent } from '../list/guest.component';
import { GuestDetailComponent } from '../detail/guest-detail.component';
import { GuestUpdateComponent } from '../update/guest-update.component';
import { GuestRoutingResolveService } from './guest-routing-resolve.service';

const guestRoute: Routes = [
  {
    path: '',
    component: GuestComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GuestDetailComponent,
    resolve: {
      guest: GuestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GuestUpdateComponent,
    resolve: {
      guest: GuestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GuestUpdateComponent,
    resolve: {
      guest: GuestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(guestRoute)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
