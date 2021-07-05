import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPaymentLog, PaymentLog } from '../payment-log.model';

import { PaymentLogService } from './payment-log.service';

describe('Service Tests', () => {
  describe('PaymentLog Service', () => {
    let service: PaymentLogService;
    let httpMock: HttpTestingController;
    let elemDefault: IPaymentLog;
    let expectedResult: IPaymentLog | IPaymentLog[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PaymentLogService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        iDPaymentLog: 0,
        dueDate: currentDate,
        status: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dueDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PaymentLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dueDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.create(new PaymentLog()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PaymentLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDPaymentLog: 1,
            dueDate: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a PaymentLog', () => {
        const patchObject = Object.assign(
          {
            iDPaymentLog: 1,
            dueDate: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          new PaymentLog()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PaymentLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDPaymentLog: 1,
            dueDate: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PaymentLog', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPaymentLogToCollectionIfMissing', () => {
        it('should add a PaymentLog to an empty array', () => {
          const paymentLog: IPaymentLog = { id: 123 };
          expectedResult = service.addPaymentLogToCollectionIfMissing([], paymentLog);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(paymentLog);
        });

        it('should not add a PaymentLog to an array that contains it', () => {
          const paymentLog: IPaymentLog = { id: 123 };
          const paymentLogCollection: IPaymentLog[] = [
            {
              ...paymentLog,
            },
            { id: 456 },
          ];
          expectedResult = service.addPaymentLogToCollectionIfMissing(paymentLogCollection, paymentLog);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PaymentLog to an array that doesn't contain it", () => {
          const paymentLog: IPaymentLog = { id: 123 };
          const paymentLogCollection: IPaymentLog[] = [{ id: 456 }];
          expectedResult = service.addPaymentLogToCollectionIfMissing(paymentLogCollection, paymentLog);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(paymentLog);
        });

        it('should add only unique PaymentLog to an array', () => {
          const paymentLogArray: IPaymentLog[] = [{ id: 123 }, { id: 456 }, { id: 38285 }];
          const paymentLogCollection: IPaymentLog[] = [{ id: 123 }];
          expectedResult = service.addPaymentLogToCollectionIfMissing(paymentLogCollection, ...paymentLogArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const paymentLog: IPaymentLog = { id: 123 };
          const paymentLog2: IPaymentLog = { id: 456 };
          expectedResult = service.addPaymentLogToCollectionIfMissing([], paymentLog, paymentLog2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(paymentLog);
          expect(expectedResult).toContain(paymentLog2);
        });

        it('should accept null and undefined values', () => {
          const paymentLog: IPaymentLog = { id: 123 };
          expectedResult = service.addPaymentLogToCollectionIfMissing([], null, paymentLog, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(paymentLog);
        });

        it('should return initial array if no PaymentLog is added', () => {
          const paymentLogCollection: IPaymentLog[] = [{ id: 123 }];
          expectedResult = service.addPaymentLogToCollectionIfMissing(paymentLogCollection, undefined, null);
          expect(expectedResult).toEqual(paymentLogCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
