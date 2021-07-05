jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ExceptionTableService } from '../service/exception-table.service';
import { IExceptionTable, ExceptionTable } from '../exception-table.model';

import { ExceptionTableUpdateComponent } from './exception-table-update.component';

describe('Component Tests', () => {
  describe('ExceptionTable Management Update Component', () => {
    let comp: ExceptionTableUpdateComponent;
    let fixture: ComponentFixture<ExceptionTableUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let exceptionTableService: ExceptionTableService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExceptionTableUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ExceptionTableUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExceptionTableUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      exceptionTableService = TestBed.inject(ExceptionTableService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const exceptionTable: IExceptionTable = { id: 456 };

        activatedRoute.data = of({ exceptionTable });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(exceptionTable));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ExceptionTable>>();
        const exceptionTable = { id: 123 };
        jest.spyOn(exceptionTableService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ exceptionTable });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exceptionTable }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(exceptionTableService.update).toHaveBeenCalledWith(exceptionTable);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ExceptionTable>>();
        const exceptionTable = new ExceptionTable();
        jest.spyOn(exceptionTableService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ exceptionTable });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exceptionTable }));
        saveSubject.complete();

        // THEN
        expect(exceptionTableService.create).toHaveBeenCalledWith(exceptionTable);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ExceptionTable>>();
        const exceptionTable = { id: 123 };
        jest.spyOn(exceptionTableService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ exceptionTable });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(exceptionTableService.update).toHaveBeenCalledWith(exceptionTable);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
