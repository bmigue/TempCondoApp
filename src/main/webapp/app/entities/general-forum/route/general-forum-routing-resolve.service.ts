import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGeneralForum, GeneralForum } from '../general-forum.model';
import { GeneralForumService } from '../service/general-forum.service';

@Injectable({ providedIn: 'root' })
export class GeneralForumRoutingResolveService implements Resolve<IGeneralForum> {
  constructor(protected service: GeneralForumService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGeneralForum> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((generalForum: HttpResponse<GeneralForum>) => {
          if (generalForum.body) {
            return of(generalForum.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new GeneralForum());
  }
}
