import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGuest, Guest } from '../guest.model';

import { GuestService } from './guest.service';

describe('Service Tests', () => {
  describe('Guest Service', () => {
    let service: GuestService;
    let httpMock: HttpTestingController;
    let elemDefault: IGuest;
    let expectedResult: IGuest | IGuest[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GuestService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        iDGuest: 0,
        fullName: 'AAAAAAA',
        plateNumber: 'AAAAAAA',
        status: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Guest', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Guest()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Guest', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDGuest: 1,
            fullName: 'BBBBBB',
            plateNumber: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Guest', () => {
        const patchObject = Object.assign(
          {
            iDGuest: 1,
            fullName: 'BBBBBB',
            plateNumber: 'BBBBBB',
            status: 'BBBBBB',
          },
          new Guest()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Guest', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDGuest: 1,
            fullName: 'BBBBBB',
            plateNumber: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Guest', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGuestToCollectionIfMissing', () => {
        it('should add a Guest to an empty array', () => {
          const guest: IGuest = { id: 123 };
          expectedResult = service.addGuestToCollectionIfMissing([], guest);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(guest);
        });

        it('should not add a Guest to an array that contains it', () => {
          const guest: IGuest = { id: 123 };
          const guestCollection: IGuest[] = [
            {
              ...guest,
            },
            { id: 456 },
          ];
          expectedResult = service.addGuestToCollectionIfMissing(guestCollection, guest);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Guest to an array that doesn't contain it", () => {
          const guest: IGuest = { id: 123 };
          const guestCollection: IGuest[] = [{ id: 456 }];
          expectedResult = service.addGuestToCollectionIfMissing(guestCollection, guest);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(guest);
        });

        it('should add only unique Guest to an array', () => {
          const guestArray: IGuest[] = [{ id: 123 }, { id: 456 }, { id: 86280 }];
          const guestCollection: IGuest[] = [{ id: 123 }];
          expectedResult = service.addGuestToCollectionIfMissing(guestCollection, ...guestArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const guest: IGuest = { id: 123 };
          const guest2: IGuest = { id: 456 };
          expectedResult = service.addGuestToCollectionIfMissing([], guest, guest2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(guest);
          expect(expectedResult).toContain(guest2);
        });

        it('should accept null and undefined values', () => {
          const guest: IGuest = { id: 123 };
          expectedResult = service.addGuestToCollectionIfMissing([], null, guest, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(guest);
        });

        it('should return initial array if no Guest is added', () => {
          const guestCollection: IGuest[] = [{ id: 123 }];
          expectedResult = service.addGuestToCollectionIfMissing(guestCollection, undefined, null);
          expect(expectedResult).toEqual(guestCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
