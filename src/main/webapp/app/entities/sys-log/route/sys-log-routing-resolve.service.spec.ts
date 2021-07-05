jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISysLog, SysLog } from '../sys-log.model';
import { SysLogService } from '../service/sys-log.service';

import { SysLogRoutingResolveService } from './sys-log-routing-resolve.service';

describe('Service Tests', () => {
  describe('SysLog routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SysLogRoutingResolveService;
    let service: SysLogService;
    let resultSysLog: ISysLog | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SysLogRoutingResolveService);
      service = TestBed.inject(SysLogService);
      resultSysLog = undefined;
    });

    describe('resolve', () => {
      it('should return ISysLog returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSysLog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSysLog).toEqual({ id: 123 });
      });

      it('should return new ISysLog if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSysLog = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSysLog).toEqual(new SysLog());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SysLog })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSysLog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSysLog).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
