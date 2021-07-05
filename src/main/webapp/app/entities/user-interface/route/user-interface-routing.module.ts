import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserInterfaceComponent } from '../list/user-interface.component';
import { UserInterfaceDetailComponent } from '../detail/user-interface-detail.component';
import { UserInterfaceUpdateComponent } from '../update/user-interface-update.component';
import { UserInterfaceRoutingResolveService } from './user-interface-routing-resolve.service';

const userInterfaceRoute: Routes = [
  {
    path: '',
    component: UserInterfaceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserInterfaceDetailComponent,
    resolve: {
      userInterface: UserInterfaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserInterfaceUpdateComponent,
    resolve: {
      userInterface: UserInterfaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserInterfaceUpdateComponent,
    resolve: {
      userInterface: UserInterfaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userInterfaceRoute)],
  exports: [RouterModule],
})
export class UserInterfaceRoutingModule {}
