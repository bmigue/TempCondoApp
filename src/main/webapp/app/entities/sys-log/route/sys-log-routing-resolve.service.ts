import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISysLog, SysLog } from '../sys-log.model';
import { SysLogService } from '../service/sys-log.service';

@Injectable({ providedIn: 'root' })
export class SysLogRoutingResolveService implements Resolve<ISysLog> {
  constructor(protected service: SysLogService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISysLog> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sysLog: HttpResponse<SysLog>) => {
          if (sysLog.body) {
            return of(sysLog.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SysLog());
  }
}
