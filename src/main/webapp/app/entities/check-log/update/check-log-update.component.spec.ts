jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CheckLogService } from '../service/check-log.service';
import { ICheckLog, CheckLog } from '../check-log.model';
import { IGuest } from 'app/entities/guest/guest.model';
import { GuestService } from 'app/entities/guest/service/guest.service';

import { CheckLogUpdateComponent } from './check-log-update.component';

describe('Component Tests', () => {
  describe('CheckLog Management Update Component', () => {
    let comp: CheckLogUpdateComponent;
    let fixture: ComponentFixture<CheckLogUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let checkLogService: CheckLogService;
    let guestService: GuestService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CheckLogUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CheckLogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CheckLogUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      checkLogService = TestBed.inject(CheckLogService);
      guestService = TestBed.inject(GuestService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Guest query and add missing value', () => {
        const checkLog: ICheckLog = { id: 456 };
        const iDCheckLogGuests: IGuest[] = [{ id: 74516 }];
        checkLog.iDCheckLogGuests = iDCheckLogGuests;

        const guestCollection: IGuest[] = [{ id: 91273 }];
        jest.spyOn(guestService, 'query').mockReturnValue(of(new HttpResponse({ body: guestCollection })));
        const additionalGuests = [...iDCheckLogGuests];
        const expectedCollection: IGuest[] = [...additionalGuests, ...guestCollection];
        jest.spyOn(guestService, 'addGuestToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ checkLog });
        comp.ngOnInit();

        expect(guestService.query).toHaveBeenCalled();
        expect(guestService.addGuestToCollectionIfMissing).toHaveBeenCalledWith(guestCollection, ...additionalGuests);
        expect(comp.guestsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const checkLog: ICheckLog = { id: 456 };
        const iDCheckLogGuests: IGuest = { id: 26007 };
        checkLog.iDCheckLogGuests = [iDCheckLogGuests];

        activatedRoute.data = of({ checkLog });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(checkLog));
        expect(comp.guestsSharedCollection).toContain(iDCheckLogGuests);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CheckLog>>();
        const checkLog = { id: 123 };
        jest.spyOn(checkLogService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ checkLog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: checkLog }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(checkLogService.update).toHaveBeenCalledWith(checkLog);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CheckLog>>();
        const checkLog = new CheckLog();
        jest.spyOn(checkLogService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ checkLog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: checkLog }));
        saveSubject.complete();

        // THEN
        expect(checkLogService.create).toHaveBeenCalledWith(checkLog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CheckLog>>();
        const checkLog = { id: 123 };
        jest.spyOn(checkLogService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ checkLog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(checkLogService.update).toHaveBeenCalledWith(checkLog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackGuestById', () => {
        it('Should return tracked Guest primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackGuestById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedGuest', () => {
        it('Should return option if no Guest is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedGuest(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Guest for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedGuest(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Guest is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedGuest(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
