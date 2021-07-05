import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGuest, Guest } from '../guest.model';
import { GuestService } from '../service/guest.service';

@Injectable({ providedIn: 'root' })
export class GuestRoutingResolveService implements Resolve<IGuest> {
  constructor(protected service: GuestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGuest> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((guest: HttpResponse<Guest>) => {
          if (guest.body) {
            return of(guest.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Guest());
  }
}
