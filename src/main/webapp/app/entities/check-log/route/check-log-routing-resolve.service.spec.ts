jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICheckLog, CheckLog } from '../check-log.model';
import { CheckLogService } from '../service/check-log.service';

import { CheckLogRoutingResolveService } from './check-log-routing-resolve.service';

describe('Service Tests', () => {
  describe('CheckLog routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CheckLogRoutingResolveService;
    let service: CheckLogService;
    let resultCheckLog: ICheckLog | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CheckLogRoutingResolveService);
      service = TestBed.inject(CheckLogService);
      resultCheckLog = undefined;
    });

    describe('resolve', () => {
      it('should return ICheckLog returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCheckLog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCheckLog).toEqual({ id: 123 });
      });

      it('should return new ICheckLog if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCheckLog = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCheckLog).toEqual(new CheckLog());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CheckLog })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCheckLog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCheckLog).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
