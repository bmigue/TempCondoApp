import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICondo, Condo } from '../condo.model';
import { CondoService } from '../service/condo.service';

@Injectable({ providedIn: 'root' })
export class CondoRoutingResolveService implements Resolve<ICondo> {
  constructor(protected service: CondoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICondo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((condo: HttpResponse<Condo>) => {
          if (condo.body) {
            return of(condo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Condo());
  }
}
