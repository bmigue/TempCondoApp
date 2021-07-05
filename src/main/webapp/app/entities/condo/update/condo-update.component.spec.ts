jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CondoService } from '../service/condo.service';
import { ICondo, Condo } from '../condo.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { CondoUpdateComponent } from './condo-update.component';

describe('Component Tests', () => {
  describe('Condo Management Update Component', () => {
    let comp: CondoUpdateComponent;
    let fixture: ComponentFixture<CondoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let condoService: CondoService;
    let userProfileService: UserProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CondoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CondoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CondoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      condoService = TestBed.inject(CondoService);
      userProfileService = TestBed.inject(UserProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserProfile query and add missing value', () => {
        const condo: ICondo = { id: 456 };
        const userProfile: IUserProfile = { id: 50449 };
        condo.userProfile = userProfile;

        const userProfileCollection: IUserProfile[] = [{ id: 79677 }];
        jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
        const additionalUserProfiles = [userProfile];
        const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
        jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ condo });
        comp.ngOnInit();

        expect(userProfileService.query).toHaveBeenCalled();
        expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
          userProfileCollection,
          ...additionalUserProfiles
        );
        expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const condo: ICondo = { id: 456 };
        const userProfile: IUserProfile = { id: 20174 };
        condo.userProfile = userProfile;

        activatedRoute.data = of({ condo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(condo));
        expect(comp.userProfilesSharedCollection).toContain(userProfile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Condo>>();
        const condo = { id: 123 };
        jest.spyOn(condoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ condo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: condo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(condoService.update).toHaveBeenCalledWith(condo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Condo>>();
        const condo = new Condo();
        jest.spyOn(condoService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ condo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: condo }));
        saveSubject.complete();

        // THEN
        expect(condoService.create).toHaveBeenCalledWith(condo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Condo>>();
        const condo = { id: 123 };
        jest.spyOn(condoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ condo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(condoService.update).toHaveBeenCalledWith(condo);
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
