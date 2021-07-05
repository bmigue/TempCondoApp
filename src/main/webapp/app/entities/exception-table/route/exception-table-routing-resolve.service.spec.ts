jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExceptionTable, ExceptionTable } from '../exception-table.model';
import { ExceptionTableService } from '../service/exception-table.service';

import { ExceptionTableRoutingResolveService } from './exception-table-routing-resolve.service';

describe('Service Tests', () => {
  describe('ExceptionTable routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ExceptionTableRoutingResolveService;
    let service: ExceptionTableService;
    let resultExceptionTable: IExceptionTable | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ExceptionTableRoutingResolveService);
      service = TestBed.inject(ExceptionTableService);
      resultExceptionTable = undefined;
    });

    describe('resolve', () => {
      it('should return IExceptionTable returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExceptionTable = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExceptionTable).toEqual({ id: 123 });
      });

      it('should return new IExceptionTable if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExceptionTable = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultExceptionTable).toEqual(new ExceptionTable());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ExceptionTable })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExceptionTable = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExceptionTable).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
