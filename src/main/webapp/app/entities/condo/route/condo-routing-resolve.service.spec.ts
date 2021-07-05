jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICondo, Condo } from '../condo.model';
import { CondoService } from '../service/condo.service';

import { CondoRoutingResolveService } from './condo-routing-resolve.service';

describe('Service Tests', () => {
  describe('Condo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CondoRoutingResolveService;
    let service: CondoService;
    let resultCondo: ICondo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CondoRoutingResolveService);
      service = TestBed.inject(CondoService);
      resultCondo = undefined;
    });

    describe('resolve', () => {
      it('should return ICondo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCondo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCondo).toEqual({ id: 123 });
      });

      it('should return new ICondo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCondo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCondo).toEqual(new Condo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Condo })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCondo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCondo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
