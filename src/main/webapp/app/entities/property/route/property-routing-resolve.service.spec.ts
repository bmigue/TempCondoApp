jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProperty, Property } from '../property.model';
import { PropertyService } from '../service/property.service';

import { PropertyRoutingResolveService } from './property-routing-resolve.service';

describe('Service Tests', () => {
  describe('Property routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PropertyRoutingResolveService;
    let service: PropertyService;
    let resultProperty: IProperty | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PropertyRoutingResolveService);
      service = TestBed.inject(PropertyService);
      resultProperty = undefined;
    });

    describe('resolve', () => {
      it('should return IProperty returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProperty = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProperty).toEqual({ id: 123 });
      });

      it('should return new IProperty if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProperty = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProperty).toEqual(new Property());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Property })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProperty = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProperty).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
