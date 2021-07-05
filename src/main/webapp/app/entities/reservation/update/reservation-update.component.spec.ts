jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReservationService } from '../service/reservation.service';
import { IReservation, Reservation } from '../reservation.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { ICommonArea } from 'app/entities/common-area/common-area.model';
import { CommonAreaService } from 'app/entities/common-area/service/common-area.service';

import { ReservationUpdateComponent } from './reservation-update.component';

describe('Component Tests', () => {
  describe('Reservation Management Update Component', () => {
    let comp: ReservationUpdateComponent;
    let fixture: ComponentFixture<ReservationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let reservationService: ReservationService;
    let userProfileService: UserProfileService;
    let commonAreaService: CommonAreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReservationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReservationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReservationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reservationService = TestBed.inject(ReservationService);
      userProfileService = TestBed.inject(UserProfileService);
      commonAreaService = TestBed.inject(CommonAreaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserProfile query and add missing value', () => {
        const reservation: IReservation = { id: 456 };
        const userProfile: IUserProfile = { id: 17545 };
        reservation.userProfile = userProfile;

        const userProfileCollection: IUserProfile[] = [{ id: 6397 }];
        jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
        const additionalUserProfiles = [userProfile];
        const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
        jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        expect(userProfileService.query).toHaveBeenCalled();
        expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
          userProfileCollection,
          ...additionalUserProfiles
        );
        expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call CommonArea query and add missing value', () => {
        const reservation: IReservation = { id: 456 };
        const commonArea: ICommonArea = { id: 48464 };
        reservation.commonArea = commonArea;

        const commonAreaCollection: ICommonArea[] = [{ id: 16678 }];
        jest.spyOn(commonAreaService, 'query').mockReturnValue(of(new HttpResponse({ body: commonAreaCollection })));
        const additionalCommonAreas = [commonArea];
        const expectedCollection: ICommonArea[] = [...additionalCommonAreas, ...commonAreaCollection];
        jest.spyOn(commonAreaService, 'addCommonAreaToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        expect(commonAreaService.query).toHaveBeenCalled();
        expect(commonAreaService.addCommonAreaToCollectionIfMissing).toHaveBeenCalledWith(commonAreaCollection, ...additionalCommonAreas);
        expect(comp.commonAreasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const reservation: IReservation = { id: 456 };
        const userProfile: IUserProfile = { id: 3294 };
        reservation.userProfile = userProfile;
        const commonArea: ICommonArea = { id: 62926 };
        reservation.commonArea = commonArea;

        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(reservation));
        expect(comp.userProfilesSharedCollection).toContain(userProfile);
        expect(comp.commonAreasSharedCollection).toContain(commonArea);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Reservation>>();
        const reservation = { id: 123 };
        jest.spyOn(reservationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reservation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reservationService.update).toHaveBeenCalledWith(reservation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Reservation>>();
        const reservation = new Reservation();
        jest.spyOn(reservationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reservation }));
        saveSubject.complete();

        // THEN
        expect(reservationService.create).toHaveBeenCalledWith(reservation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Reservation>>();
        const reservation = { id: 123 };
        jest.spyOn(reservationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reservationService.update).toHaveBeenCalledWith(reservation);
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

      describe('trackCommonAreaById', () => {
        it('Should return tracked CommonArea primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCommonAreaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
