import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserInterface, UserInterface } from '../user-interface.model';

import { UserInterfaceService } from './user-interface.service';

describe('Service Tests', () => {
  describe('UserInterface Service', () => {
    let service: UserInterfaceService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserInterface;
    let expectedResult: IUserInterface | IUserInterface[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserInterfaceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        iDUserInterface: 0,
        themeName: 'AAAAAAA',
        color: 'AAAAAAA',
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

      it('should create a UserInterface', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UserInterface()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserInterface', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDUserInterface: 1,
            themeName: 'BBBBBB',
            color: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserInterface', () => {
        const patchObject = Object.assign(
          {
            iDUserInterface: 1,
            themeName: 'BBBBBB',
            color: 'BBBBBB',
          },
          new UserInterface()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserInterface', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            iDUserInterface: 1,
            themeName: 'BBBBBB',
            color: 'BBBBBB',
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

      it('should delete a UserInterface', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserInterfaceToCollectionIfMissing', () => {
        it('should add a UserInterface to an empty array', () => {
          const userInterface: IUserInterface = { id: 123 };
          expectedResult = service.addUserInterfaceToCollectionIfMissing([], userInterface);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userInterface);
        });

        it('should not add a UserInterface to an array that contains it', () => {
          const userInterface: IUserInterface = { id: 123 };
          const userInterfaceCollection: IUserInterface[] = [
            {
              ...userInterface,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserInterfaceToCollectionIfMissing(userInterfaceCollection, userInterface);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserInterface to an array that doesn't contain it", () => {
          const userInterface: IUserInterface = { id: 123 };
          const userInterfaceCollection: IUserInterface[] = [{ id: 456 }];
          expectedResult = service.addUserInterfaceToCollectionIfMissing(userInterfaceCollection, userInterface);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userInterface);
        });

        it('should add only unique UserInterface to an array', () => {
          const userInterfaceArray: IUserInterface[] = [{ id: 123 }, { id: 456 }, { id: 48613 }];
          const userInterfaceCollection: IUserInterface[] = [{ id: 123 }];
          expectedResult = service.addUserInterfaceToCollectionIfMissing(userInterfaceCollection, ...userInterfaceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userInterface: IUserInterface = { id: 123 };
          const userInterface2: IUserInterface = { id: 456 };
          expectedResult = service.addUserInterfaceToCollectionIfMissing([], userInterface, userInterface2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userInterface);
          expect(expectedResult).toContain(userInterface2);
        });

        it('should accept null and undefined values', () => {
          const userInterface: IUserInterface = { id: 123 };
          expectedResult = service.addUserInterfaceToCollectionIfMissing([], null, userInterface, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userInterface);
        });

        it('should return initial array if no UserInterface is added', () => {
          const userInterfaceCollection: IUserInterface[] = [{ id: 123 }];
          expectedResult = service.addUserInterfaceToCollectionIfMissing(userInterfaceCollection, undefined, null);
          expect(expectedResult).toEqual(userInterfaceCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
