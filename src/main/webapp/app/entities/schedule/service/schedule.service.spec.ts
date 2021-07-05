import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISchedule, Schedule } from '../schedule.model';

import { ScheduleService } from './schedule.service';

describe('Service Tests', () => {
  describe('Schedule Service', () => {
    let service: ScheduleService;
    let httpMock: HttpTestingController;
    let elemDefault: ISchedule;
    let expectedResult: ISchedule | ISchedule[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ScheduleService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        iDSchedule: 0,
        inDateTime: currentDate,
        outDateTime: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Schedule', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new Schedule()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Schedule', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDSchedule: 1,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Schedule', () => {
        const patchObject = Object.assign(
          {
            iDSchedule: 1,
          },
          new Schedule()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Schedule', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDSchedule: 1,
            inDateTime: currentDate.format(DATE_TIME_FORMAT),
            outDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            inDateTime: currentDate,
            outDateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Schedule', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addScheduleToCollectionIfMissing', () => {
        it('should add a Schedule to an empty array', () => {
          const schedule: ISchedule = { id: 123 };
          expectedResult = service.addScheduleToCollectionIfMissing([], schedule);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(schedule);
        });

        it('should not add a Schedule to an array that contains it', () => {
          const schedule: ISchedule = { id: 123 };
          const scheduleCollection: ISchedule[] = [
            {
              ...schedule,
            },
            { id: 456 },
          ];
          expectedResult = service.addScheduleToCollectionIfMissing(scheduleCollection, schedule);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Schedule to an array that doesn't contain it", () => {
          const schedule: ISchedule = { id: 123 };
          const scheduleCollection: ISchedule[] = [{ id: 456 }];
          expectedResult = service.addScheduleToCollectionIfMissing(scheduleCollection, schedule);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(schedule);
        });

        it('should add only unique Schedule to an array', () => {
          const scheduleArray: ISchedule[] = [{ id: 123 }, { id: 456 }, { id: 12990 }];
          const scheduleCollection: ISchedule[] = [{ id: 123 }];
          expectedResult = service.addScheduleToCollectionIfMissing(scheduleCollection, ...scheduleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const schedule: ISchedule = { id: 123 };
          const schedule2: ISchedule = { id: 456 };
          expectedResult = service.addScheduleToCollectionIfMissing([], schedule, schedule2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(schedule);
          expect(expectedResult).toContain(schedule2);
        });

        it('should accept null and undefined values', () => {
          const schedule: ISchedule = { id: 123 };
          expectedResult = service.addScheduleToCollectionIfMissing([], null, schedule, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(schedule);
        });

        it('should return initial array if no Schedule is added', () => {
          const scheduleCollection: ISchedule[] = [{ id: 123 }];
          expectedResult = service.addScheduleToCollectionIfMissing(scheduleCollection, undefined, null);
          expect(expectedResult).toEqual(scheduleCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
