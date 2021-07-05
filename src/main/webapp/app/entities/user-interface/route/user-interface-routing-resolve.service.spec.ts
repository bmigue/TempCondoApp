jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserInterface, UserInterface } from '../user-interface.model';
import { UserInterfaceService } from '../service/user-interface.service';

import { UserInterfaceRoutingResolveService } from './user-interface-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserInterface routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserInterfaceRoutingResolveService;
    let service: UserInterfaceService;
    let resultUserInterface: IUserInterface | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserInterfaceRoutingResolveService);
      service = TestBed.inject(UserInterfaceService);
      resultUserInterface = undefined;
    });

    describe('resolve', () => {
      it('should return IUserInterface returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserInterface = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserInterface).toEqual({ id: 123 });
      });

      it('should return new IUserInterface if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserInterface = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserInterface).toEqual(new UserInterface());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserInterface })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserInterface = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserInterface).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
