jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserInterfaceService } from '../service/user-interface.service';
import { IUserInterface, UserInterface } from '../user-interface.model';

import { UserInterfaceUpdateComponent } from './user-interface-update.component';

describe('Component Tests', () => {
  describe('UserInterface Management Update Component', () => {
    let comp: UserInterfaceUpdateComponent;
    let fixture: ComponentFixture<UserInterfaceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userInterfaceService: UserInterfaceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserInterfaceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserInterfaceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserInterfaceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userInterfaceService = TestBed.inject(UserInterfaceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const userInterface: IUserInterface = { id: 456 };

        activatedRoute.data = of({ userInterface });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userInterface));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserInterface>>();
        const userInterface = { id: 123 };
        jest.spyOn(userInterfaceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userInterface });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userInterface }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userInterfaceService.update).toHaveBeenCalledWith(userInterface);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserInterface>>();
        const userInterface = new UserInterface();
        jest.spyOn(userInterfaceService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userInterface });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userInterface }));
        saveSubject.complete();

        // THEN
        expect(userInterfaceService.create).toHaveBeenCalledWith(userInterface);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserInterface>>();
        const userInterface = { id: 123 };
        jest.spyOn(userInterfaceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userInterface });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userInterfaceService.update).toHaveBeenCalledWith(userInterface);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
