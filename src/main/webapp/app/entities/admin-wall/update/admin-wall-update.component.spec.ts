jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AdminWallService } from '../service/admin-wall.service';
import { IAdminWall, AdminWall } from '../admin-wall.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { AdminWallUpdateComponent } from './admin-wall-update.component';

describe('Component Tests', () => {
  describe('AdminWall Management Update Component', () => {
    let comp: AdminWallUpdateComponent;
    let fixture: ComponentFixture<AdminWallUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let adminWallService: AdminWallService;
    let userProfileService: UserProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AdminWallUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AdminWallUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdminWallUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      adminWallService = TestBed.inject(AdminWallService);
      userProfileService = TestBed.inject(UserProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserProfile query and add missing value', () => {
        const adminWall: IAdminWall = { id: 456 };
        const userProfile: IUserProfile = { id: 7326 };
        adminWall.userProfile = userProfile;

        const userProfileCollection: IUserProfile[] = [{ id: 58964 }];
        jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
        const additionalUserProfiles = [userProfile];
        const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
        jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ adminWall });
        comp.ngOnInit();

        expect(userProfileService.query).toHaveBeenCalled();
        expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
          userProfileCollection,
          ...additionalUserProfiles
        );
        expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const adminWall: IAdminWall = { id: 456 };
        const userProfile: IUserProfile = { id: 14783 };
        adminWall.userProfile = userProfile;

        activatedRoute.data = of({ adminWall });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(adminWall));
        expect(comp.userProfilesSharedCollection).toContain(userProfile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AdminWall>>();
        const adminWall = { id: 123 };
        jest.spyOn(adminWallService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ adminWall });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: adminWall }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(adminWallService.update).toHaveBeenCalledWith(adminWall);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AdminWall>>();
        const adminWall = new AdminWall();
        jest.spyOn(adminWallService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ adminWall });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: adminWall }));
        saveSubject.complete();

        // THEN
        expect(adminWallService.create).toHaveBeenCalledWith(adminWall);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AdminWall>>();
        const adminWall = { id: 123 };
        jest.spyOn(adminWallService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ adminWall });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(adminWallService.update).toHaveBeenCalledWith(adminWall);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserProfileById', () => {
        it('Should return tracked UserProfile primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserProfileById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
