jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GeneralForumService } from '../service/general-forum.service';
import { IGeneralForum, GeneralForum } from '../general-forum.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { GeneralForumUpdateComponent } from './general-forum-update.component';

describe('Component Tests', () => {
  describe('GeneralForum Management Update Component', () => {
    let comp: GeneralForumUpdateComponent;
    let fixture: ComponentFixture<GeneralForumUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let generalForumService: GeneralForumService;
    let userProfileService: UserProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GeneralForumUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GeneralForumUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GeneralForumUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      generalForumService = TestBed.inject(GeneralForumService);
      userProfileService = TestBed.inject(UserProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserProfile query and add missing value', () => {
        const generalForum: IGeneralForum = { id: 456 };
        const userProfile: IUserProfile = { id: 36751 };
        generalForum.userProfile = userProfile;

        const userProfileCollection: IUserProfile[] = [{ id: 82206 }];
        jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
        const additionalUserProfiles = [userProfile];
        const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
        jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ generalForum });
        comp.ngOnInit();

        expect(userProfileService.query).toHaveBeenCalled();
        expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
          userProfileCollection,
          ...additionalUserProfiles
        );
        expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const generalForum: IGeneralForum = { id: 456 };
        const userProfile: IUserProfile = { id: 39706 };
        generalForum.userProfile = userProfile;

        activatedRoute.data = of({ generalForum });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(generalForum));
        expect(comp.userProfilesSharedCollection).toContain(userProfile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<GeneralForum>>();
        const generalForum = { id: 123 };
        jest.spyOn(generalForumService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ generalForum });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: generalForum }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(generalForumService.update).toHaveBeenCalledWith(generalForum);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<GeneralForum>>();
        const generalForum = new GeneralForum();
        jest.spyOn(generalForumService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ generalForum });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: generalForum }));
        saveSubject.complete();

        // THEN
        expect(generalForumService.create).toHaveBeenCalledWith(generalForum);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<GeneralForum>>();
        const generalForum = { id: 123 };
        jest.spyOn(generalForumService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ generalForum });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(generalForumService.update).toHaveBeenCalledWith(generalForum);
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
