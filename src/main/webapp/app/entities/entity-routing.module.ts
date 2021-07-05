import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'condo',
        data: { pageTitle: 'tempcondoappApp.condo.home.title' },
        loadChildren: () => import('./condo/condo.module').then(m => m.CondoModule),
      },
      {
        path: 'common-area',
        data: { pageTitle: 'tempcondoappApp.commonArea.home.title' },
        loadChildren: () => import('./common-area/common-area.module').then(m => m.CommonAreaModule),
      },
      {
        path: 'media',
        data: { pageTitle: 'tempcondoappApp.media.home.title' },
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
      },
      {
        path: 'exception-table',
        data: { pageTitle: 'tempcondoappApp.exceptionTable.home.title' },
        loadChildren: () => import('./exception-table/exception-table.module').then(m => m.ExceptionTableModule),
      },
      {
        path: 'reservation',
        data: { pageTitle: 'tempcondoappApp.reservation.home.title' },
        loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule),
      },
      {
        path: 'user-interface',
        data: { pageTitle: 'tempcondoappApp.userInterface.home.title' },
        loadChildren: () => import('./user-interface/user-interface.module').then(m => m.UserInterfaceModule),
      },
      {
        path: 'schedule',
        data: { pageTitle: 'tempcondoappApp.schedule.home.title' },
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
      },
      {
        path: 'property',
        data: { pageTitle: 'tempcondoappApp.property.home.title' },
        loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
      },
      {
        path: 'user-profile',
        data: { pageTitle: 'tempcondoappApp.userProfile.home.title' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'guest',
        data: { pageTitle: 'tempcondoappApp.guest.home.title' },
        loadChildren: () => import('./guest/guest.module').then(m => m.GuestModule),
      },
      {
        path: 'sys-log',
        data: { pageTitle: 'tempcondoappApp.sysLog.home.title' },
        loadChildren: () => import('./sys-log/sys-log.module').then(m => m.SysLogModule),
      },
      {
        path: 'check-log',
        data: { pageTitle: 'tempcondoappApp.checkLog.home.title' },
        loadChildren: () => import('./check-log/check-log.module').then(m => m.CheckLogModule),
      },
      {
        path: 'payment-log',
        data: { pageTitle: 'tempcondoappApp.paymentLog.home.title' },
        loadChildren: () => import('./payment-log/payment-log.module').then(m => m.PaymentLogModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'tempcondoappApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'admin-wall',
        data: { pageTitle: 'tempcondoappApp.adminWall.home.title' },
        loadChildren: () => import('./admin-wall/admin-wall.module').then(m => m.AdminWallModule),
      },
      {
        path: 'general-forum',
        data: { pageTitle: 'tempcondoappApp.generalForum.home.title' },
        loadChildren: () => import('./general-forum/general-forum.module').then(m => m.GeneralForumModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
