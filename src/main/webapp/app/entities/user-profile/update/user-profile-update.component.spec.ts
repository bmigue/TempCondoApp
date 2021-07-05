jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserProfileService } from '../service/user-profile.service';
import { IUserProfile, UserProfile } from '../user-profile.model';
import { IUserInterface } from 'app/entities/user-interface/user-interface.model';
import { UserInterfaceService } from 'app/entities/user-interface/service/user-interface.service';

import { UserProfileUpdateComponent } from './user-profile-update.component';

describe('Component Tests', () => {
  describe('UserProfile Management Update Component', () => {
    let comp: UserProfileUpdateComponent;
    let fixture: ComponentFixture<UserProfileUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userProfileService: UserProfileService;
    let userInterfaceService: UserInterfaceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserProfileUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserProfileUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserProfileUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userProfileService = TestBed.inject(UserProfileService);
      userInterfaceService = TestBed.inject(UserInterfaceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call idUserUserInterface query and add missing value', () => {
        const userProfile: IUserProfile = { id: 456 };
        const idUserUserInterface: IUserInterface = { id: 93461 };
        userProfile.idUserUserInterface = idUserUserInterface;

        const idUserUserInterfaceCollection: IUserInterface[] = [{ id: 82884 }];
        jest.spyOn(userInterfaceService, 'query').mockReturnValue(of(new HttpResponse({ body: idUserUserInterfaceCollection })));
        const expectedCollection: IUserInterface[] = [idUserUserInterface, ...idUserUserInterfaceCollection];
        jest.spyOn(userInterfaceService, 'addUserInterfaceToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userProfile });
        comp.ngOnInit();

        expect(userInterfaceService.query).toHaveBeenCalled();
        expect(userInterfaceService.addUserInterfaceToCollectionIfMissing).toHaveBeenCalledWith(
          idUserUserInterfaceCollection,
          idUserUserInterface
        );
        expect(comp.idUserUserInterfacesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const userProfile: IUserProfile = { id: 456 };
        const idUserUserInterface: IUserInterface = { id: 52634 };
        userProfile.idUserUserInterface = idUserUserInterface;

        activatedRoute.data = of({ userProfile });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userProfile));
        expect(comp.idUserUserInterfacesCollection).toContain(idUserUserInterface);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserProfile>>();
        const userProfile = { id: 123 };
        jest.spyOn(userProfileService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userProfile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userProfile }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userProfileService.update).toHaveBeenCalledWith(userProfile);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserProfile>>();
        const userProfile = new UserProfile();
        jest.spyOn(userProfileService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userProfile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userProfile }));
        saveSubject.complete();

        // THEN
        expect(userProfileService.create).toHaveBeenCalledWith(userProfile);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserProfile>>();
        const userProfile = { id: 123 };
        jest.spyOn(userProfileService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userProfile });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userProfileService.update).toHaveBeenCalledWith(userProfile);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserInterfaceById', () => {
        it('Should return tracked UserInterface primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserInterfaceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
