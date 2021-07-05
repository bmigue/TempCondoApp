import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProperty, Property } from '../property.model';
import { PropertyService } from '../service/property.service';

@Injectable({ providedIn: 'root' })
export class PropertyRoutingResolveService implements Resolve<IProperty> {
  constructor(protected service: PropertyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProperty> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((property: HttpResponse<Property>) => {
          if (property.body) {
            return of(property.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Property());
  }
}
