import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExceptionTable, ExceptionTable } from '../exception-table.model';
import { ExceptionTableService } from '../service/exception-table.service';

@Injectable({ providedIn: 'root' })
export class ExceptionTableRoutingResolveService implements Resolve<IExceptionTable> {
  constructor(protected service: ExceptionTableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExceptionTable> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exceptionTable: HttpResponse<ExceptionTable>) => {
          if (exceptionTable.body) {
            return of(exceptionTable.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExceptionTable());
  }
}
