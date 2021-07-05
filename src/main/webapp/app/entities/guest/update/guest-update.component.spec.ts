jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GuestService } from '../service/guest.service';
import { IGuest, Guest } from '../guest.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { GuestUpdateComponent } from './guest-update.component';

describe('Component Tests', () => {
  describe('Guest Management Update Component', () => {
    let comp: GuestUpdateComponent;
    let fixture: ComponentFixture<GuestUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let guestService: GuestService;
    let userProfileService: UserProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GuestUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GuestUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GuestUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      guestService = TestBed.inject(GuestService);
      userProfileService = TestBed.inject(UserProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserProfile query and add missing value', () => {
        const guest: IGuest = { id: 456 };
        const userProfile: IUserProfile = { id: 62538 };
        guest.userProfile = userProfile;

        const userProfileCollection: IUserProfile[] = [{ id: 54231 }];
        jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
        const additionalUserProfiles = [userProfile];
        const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
        jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ guest });
        comp.ngOnInit();

        expect(userProfileService.query).toHaveBeenCalled();
        expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
          userProfileCollection,
          ...additionalUserProfiles
        );
        expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const guest: IGuest = { id: 456 };
        const userProfile: IUserProfile = { id: 99929 };
        guest.userProfile = userProfile;

        activatedRoute.data = of({ guest });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(guest));
        expect(comp.userProfilesSharedCollection).toContain(userProfile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Guest>>();
        const guest = { id: 123 };
        jest.spyOn(guestService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ guest });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: guest }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(guestService.update).toHaveBeenCalledWith(guest);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Guest>>();
        const guest = new Guest();
        jest.spyOn(guestService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ guest });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: guest }));
        saveSubject.complete();

        // THEN
        expect(guestService.create).toHaveBeenCalledWith(guest);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Guest>>();
        const guest = { id: 123 };
        jest.spyOn(guestService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ guest });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(guestService.update).toHaveBeenCalledWith(guest);
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
