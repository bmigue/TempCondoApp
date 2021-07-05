jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICommonArea, CommonArea } from '../common-area.model';
import { CommonAreaService } from '../service/common-area.service';

import { CommonAreaRoutingResolveService } from './common-area-routing-resolve.service';

describe('Service Tests', () => {
  describe('CommonArea routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CommonAreaRoutingResolveService;
    let service: CommonAreaService;
    let resultCommonArea: ICommonArea | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CommonAreaRoutingResolveService);
      service = TestBed.inject(CommonAreaService);
      resultCommonArea = undefined;
    });

    describe('resolve', () => {
      it('should return ICommonArea returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommonArea = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCommonArea).toEqual({ id: 123 });
      });

      it('should return new ICommonArea if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommonArea = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCommonArea).toEqual(new CommonArea());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CommonArea })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommonArea = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCommonArea).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
