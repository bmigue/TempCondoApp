import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GeneralForumComponent } from '../list/general-forum.component';
import { GeneralForumDetailComponent } from '../detail/general-forum-detail.component';
import { GeneralForumUpdateComponent } from '../update/general-forum-update.component';
import { GeneralForumRoutingResolveService } from './general-forum-routing-resolve.service';

const generalForumRoute: Routes = [
  {
    path: '',
    component: GeneralForumComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GeneralForumDetailComponent,
    resolve: {
      generalForum: GeneralForumRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GeneralForumUpdateComponent,
    resolve: {
      generalForum: GeneralForumRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GeneralForumUpdateComponent,
    resolve: {
      generalForum: GeneralForumRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(generalForumRoute)],
  exports: [RouterModule],
})
export class GeneralForumRoutingModule {}
