jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGeneralForum, GeneralForum } from '../general-forum.model';
import { GeneralForumService } from '../service/general-forum.service';

import { GeneralForumRoutingResolveService } from './general-forum-routing-resolve.service';

describe('Service Tests', () => {
  describe('GeneralForum routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: GeneralForumRoutingResolveService;
    let service: GeneralForumService;
    let resultGeneralForum: IGeneralForum | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(GeneralForumRoutingResolveService);
      service = TestBed.inject(GeneralForumService);
      resultGeneralForum = undefined;
    });

    describe('resolve', () => {
      it('should return IGeneralForum returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGeneralForum = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGeneralForum).toEqual({ id: 123 });
      });

      it('should return new IGeneralForum if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGeneralForum = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultGeneralForum).toEqual(new GeneralForum());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as GeneralForum })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGeneralForum = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGeneralForum).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
