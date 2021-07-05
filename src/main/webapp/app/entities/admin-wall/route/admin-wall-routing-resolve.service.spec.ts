jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAdminWall, AdminWall } from '../admin-wall.model';
import { AdminWallService } from '../service/admin-wall.service';

import { AdminWallRoutingResolveService } from './admin-wall-routing-resolve.service';

describe('Service Tests', () => {
  describe('AdminWall routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AdminWallRoutingResolveService;
    let service: AdminWallService;
    let resultAdminWall: IAdminWall | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AdminWallRoutingResolveService);
      service = TestBed.inject(AdminWallService);
      resultAdminWall = undefined;
    });

    describe('resolve', () => {
      it('should return IAdminWall returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAdminWall = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAdminWall).toEqual({ id: 123 });
      });

      it('should return new IAdminWall if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAdminWall = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAdminWall).toEqual(new AdminWall());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AdminWall })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAdminWall = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAdminWall).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
