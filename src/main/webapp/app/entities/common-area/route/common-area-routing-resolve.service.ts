import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommonArea, CommonArea } from '../common-area.model';
import { CommonAreaService } from '../service/common-area.service';

@Injectable({ providedIn: 'root' })
export class CommonAreaRoutingResolveService implements Resolve<ICommonArea> {
  constructor(protected service: CommonAreaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommonArea> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commonArea: HttpResponse<CommonArea>) => {
          if (commonArea.body) {
            return of(commonArea.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CommonArea());
  }
}
