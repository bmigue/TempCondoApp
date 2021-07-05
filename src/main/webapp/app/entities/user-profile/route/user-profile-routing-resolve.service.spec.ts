jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserProfile, UserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';

import { UserProfileRoutingResolveService } from './user-profile-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserProfile routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserProfileRoutingResolveService;
    let service: UserProfileService;
    let resultUserProfile: IUserProfile | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserProfileRoutingResolveService);
      service = TestBed.inject(UserProfileService);
      resultUserProfile = undefined;
    });

    describe('resolve', () => {
      it('should return IUserProfile returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserProfile = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserProfile).toEqual({ id: 123 });
      });

      it('should return new IUserProfile if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserProfile = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserProfile).toEqual(new UserProfile());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserProfile })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserProfile = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserProfile).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
