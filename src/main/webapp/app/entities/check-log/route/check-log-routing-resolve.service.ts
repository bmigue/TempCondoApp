import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckLog, CheckLog } from '../check-log.model';
import { CheckLogService } from '../service/check-log.service';

@Injectable({ providedIn: 'root' })
export class CheckLogRoutingResolveService implements Resolve<ICheckLog> {
  constructor(protected service: CheckLogService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICheckLog> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((checkLog: HttpResponse<CheckLog>) => {
          if (checkLog.body) {
            return of(checkLog.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CheckLog());
  }
}
