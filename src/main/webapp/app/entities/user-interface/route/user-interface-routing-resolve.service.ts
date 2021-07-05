import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserInterface, UserInterface } from '../user-interface.model';
import { UserInterfaceService } from '../service/user-interface.service';

@Injectable({ providedIn: 'root' })
export class UserInterfaceRoutingResolveService implements Resolve<IUserInterface> {
  constructor(protected service: UserInterfaceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserInterface> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userInterface: HttpResponse<UserInterface>) => {
          if (userInterface.body) {
            return of(userInterface.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserInterface());
  }
}
