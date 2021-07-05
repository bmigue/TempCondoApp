import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAdminWall, AdminWall } from '../admin-wall.model';

import { AdminWallService } from './admin-wall.service';

describe('Service Tests', () => {
  describe('AdminWall Service', () => {
    let service: AdminWallService;
    let httpMock: HttpTestingController;
    let elemDefault: IAdminWall;
    let expectedResult: IAdminWall | IAdminWall[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AdminWallService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        iDAdminWall: 0,
        postDate: currentDate,
        post: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            postDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AdminWall', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            postDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            postDate: currentDate,
          },
          returnedFromService
        );

        service.create(new AdminWall()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AdminWall', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDAdminWall: 1,
            postDate: currentDate.format(DATE_TIME_FORMAT),
            post: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            postDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AdminWall', () => {
        const patchObject = Object.assign(
          {
            postDate: currentDate.format(DATE_TIME_FORMAT),
          },
          new AdminWall()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            postDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AdminWall', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDAdminWall: 1,
            postDate: currentDate.format(DATE_TIME_FORMAT),
            post: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            postDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AdminWall', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAdminWallToCollectionIfMissing', () => {
        it('should add a AdminWall to an empty array', () => {
          const adminWall: IAdminWall = { id: 123 };
          expectedResult = service.addAdminWallToCollectionIfMissing([], adminWall);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(adminWall);
        });

        it('should not add a AdminWall to an array that contains it', () => {
          const adminWall: IAdminWall = { id: 123 };
          const adminWallCollection: IAdminWall[] = [
            {
              ...adminWall,
            },
            { id: 456 },
          ];
          expectedResult = service.addAdminWallToCollectionIfMissing(adminWallCollection, adminWall);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AdminWall to an array that doesn't contain it", () => {
          const adminWall: IAdminWall = { id: 123 };
          const adminWallCollection: IAdminWall[] = [{ id: 456 }];
          expectedResult = service.addAdminWallToCollectionIfMissing(adminWallCollection, adminWall);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(adminWall);
        });

        it('should add only unique AdminWall to an array', () => {
          const adminWallArray: IAdminWall[] = [{ id: 123 }, { id: 456 }, { id: 86581 }];
          const adminWallCollection: IAdminWall[] = [{ id: 123 }];
          expectedResult = service.addAdminWallToCollectionIfMissing(adminWallCollection, ...adminWallArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const adminWall: IAdminWall = { id: 123 };
          const adminWall2: IAdminWall = { id: 456 };
          expectedResult = service.addAdminWallToCollectionIfMissing([], adminWall, adminWall2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(adminWall);
          expect(expectedResult).toContain(adminWall2);
        });

        it('should accept null and undefined values', () => {
          const adminWall: IAdminWall = { id: 123 };
          expectedResult = service.addAdminWallToCollectionIfMissing([], null, adminWall, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(adminWall);
        });

        it('should return initial array if no AdminWall is added', () => {
          const adminWallCollection: IAdminWall[] = [{ id: 123 }];
          expectedResult = service.addAdminWallToCollectionIfMissing(adminWallCollection, undefined, null);
          expect(expectedResult).toEqual(adminWallCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
