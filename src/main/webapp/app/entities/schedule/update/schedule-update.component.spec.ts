jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ScheduleService } from '../service/schedule.service';
import { ISchedule, Schedule } from '../schedule.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { ScheduleUpdateComponent } from './schedule-update.component';

describe('Component Tests', () => {
  describe('Schedule Management Update Component', () => {
    let comp: ScheduleUpdateComponent;
    let fixture: ComponentFixture<ScheduleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let scheduleService: ScheduleService;
    let userProfileService: UserProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ScheduleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ScheduleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ScheduleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      scheduleService = TestBed.inject(ScheduleService);
      userProfileService = TestBed.inject(UserProfileService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserProfile query and add missing value', () => {
        const schedule: ISchedule = { id: 456 };
        const userProfile: IUserProfile = { id: 64772 };
        schedule.userProfile = userProfile;

        const userProfileCollection: IUserProfile[] = [{ id: 4863 }];
        jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
        const additionalUserProfiles = [userProfile];
        const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
        jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ schedule });
        comp.ngOnInit();

        expect(userProfileService.query).toHaveBeenCalled();
        expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
          userProfileCollection,
          ...additionalUserProfiles
        );
        expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const schedule: ISchedule = { id: 456 };
        const userProfile: IUserProfile = { id: 66440 };
        schedule.userProfile = userProfile;

        activatedRoute.data = of({ schedule });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(schedule));
        expect(comp.userProfilesSharedCollection).toContain(userProfile);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Schedule>>();
        const schedule = { id: 123 };
        jest.spyOn(scheduleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ schedule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: schedule }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(scheduleService.update).toHaveBeenCalledWith(schedule);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Schedule>>();
        const schedule = new Schedule();
        jest.spyOn(scheduleService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ schedule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: schedule }));
        saveSubject.complete();

        // THEN
        expect(scheduleService.create).toHaveBeenCalledWith(schedule);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Schedule>>();
        const schedule = { id: 123 };
        jest.spyOn(scheduleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ schedule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(scheduleService.update).toHaveBeenCalledWith(schedule);
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
