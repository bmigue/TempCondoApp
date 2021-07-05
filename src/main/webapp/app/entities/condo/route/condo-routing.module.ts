import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CondoComponent } from '../list/condo.component';
import { CondoDetailComponent } from '../detail/condo-detail.component';
import { CondoUpdateComponent } from '../update/condo-update.component';
import { CondoRoutingResolveService } from './condo-routing-resolve.service';

const condoRoute: Routes = [
  {
    path: '',
    component: CondoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CondoDetailComponent,
    resolve: {
      condo: CondoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CondoUpdateComponent,
    resolve: {
      condo: CondoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CondoUpdateComponent,
    resolve: {
      condo: CondoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(condoRoute)],
  exports: [RouterModule],
})
export class CondoRoutingModule {}
