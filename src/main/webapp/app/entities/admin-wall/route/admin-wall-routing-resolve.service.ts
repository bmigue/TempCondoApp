import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdminWall, AdminWall } from '../admin-wall.model';
import { AdminWallService } from '../service/admin-wall.service';

@Injectable({ providedIn: 'root' })
export class AdminWallRoutingResolveService implements Resolve<IAdminWall> {
  constructor(protected service: AdminWallService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdminWall> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((adminWall: HttpResponse<AdminWall>) => {
          if (adminWall.body) {
            return of(adminWall.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AdminWall());
  }
}
