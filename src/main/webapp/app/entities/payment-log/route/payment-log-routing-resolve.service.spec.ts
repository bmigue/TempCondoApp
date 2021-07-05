jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPaymentLog, PaymentLog } from '../payment-log.model';
import { PaymentLogService } from '../service/payment-log.service';

import { PaymentLogRoutingResolveService } from './payment-log-routing-resolve.service';

describe('Service Tests', () => {
  describe('PaymentLog routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PaymentLogRoutingResolveService;
    let service: PaymentLogService;
    let resultPaymentLog: IPaymentLog | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PaymentLogRoutingResolveService);
      service = TestBed.inject(PaymentLogService);
      resultPaymentLog = undefined;
    });

    describe('resolve', () => {
      it('should return IPaymentLog returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPaymentLog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPaymentLog).toEqual({ id: 123 });
      });

      it('should return new IPaymentLog if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPaymentLog = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPaymentLog).toEqual(new PaymentLog());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PaymentLog })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPaymentLog = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPaymentLog).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
