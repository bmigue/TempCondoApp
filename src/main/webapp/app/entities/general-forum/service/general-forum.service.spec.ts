import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGeneralForum, GeneralForum } from '../general-forum.model';

import { GeneralForumService } from './general-forum.service';

describe('Service Tests', () => {
  describe('GeneralForum Service', () => {
    let service: GeneralForumService;
    let httpMock: HttpTestingController;
    let elemDefault: IGeneralForum;
    let expectedResult: IGeneralForum | IGeneralForum[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GeneralForumService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        iDGeneralForum: 0,
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

      it('should create a GeneralForum', () => {
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

        service.create(new GeneralForum()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a GeneralForum', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDGeneralForum: 1,
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

      it('should partial update a GeneralForum', () => {
        const patchObject = Object.assign(
          {
            postDate: currentDate.format(DATE_TIME_FORMAT),
            post: 'BBBBBB',
          },
          new GeneralForum()
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

      it('should return a list of GeneralForum', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDGeneralForum: 1,
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

      it('should delete a GeneralForum', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGeneralForumToCollectionIfMissing', () => {
        it('should add a GeneralForum to an empty array', () => {
          const generalForum: IGeneralForum = { id: 123 };
          expectedResult = service.addGeneralForumToCollectionIfMissing([], generalForum);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(generalForum);
        });

        it('should not add a GeneralForum to an array that contains it', () => {
          const generalForum: IGeneralForum = { id: 123 };
          const generalForumCollection: IGeneralForum[] = [
            {
              ...generalForum,
            },
            { id: 456 },
          ];
          expectedResult = service.addGeneralForumToCollectionIfMissing(generalForumCollection, generalForum);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a GeneralForum to an array that doesn't contain it", () => {
          const generalForum: IGeneralForum = { id: 123 };
          const generalForumCollection: IGeneralForum[] = [{ id: 456 }];
          expectedResult = service.addGeneralForumToCollectionIfMissing(generalForumCollection, generalForum);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(generalForum);
        });

        it('should add only unique GeneralForum to an array', () => {
          const generalForumArray: IGeneralForum[] = [{ id: 123 }, { id: 456 }, { id: 12273 }];
          const generalForumCollection: IGeneralForum[] = [{ id: 123 }];
          expectedResult = service.addGeneralForumToCollectionIfMissing(generalForumCollection, ...generalForumArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const generalForum: IGeneralForum = { id: 123 };
          const generalForum2: IGeneralForum = { id: 456 };
          expectedResult = service.addGeneralForumToCollectionIfMissing([], generalForum, generalForum2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(generalForum);
          expect(expectedResult).toContain(generalForum2);
        });

        it('should accept null and undefined values', () => {
          const generalForum: IGeneralForum = { id: 123 };
          expectedResult = service.addGeneralForumToCollectionIfMissing([], null, generalForum, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(generalForum);
        });

        it('should return initial array if no GeneralForum is added', () => {
          const generalForumCollection: IGeneralForum[] = [{ id: 123 }];
          expectedResult = service.addGeneralForumToCollectionIfMissing(generalForumCollection, undefined, null);
          expect(expectedResult).toEqual(generalForumCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
