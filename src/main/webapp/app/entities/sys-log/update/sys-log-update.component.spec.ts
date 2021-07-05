jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SysLogService } from '../service/sys-log.service';
import { ISysLog, SysLog } from '../sys-log.model';

import { SysLogUpdateComponent } from './sys-log-update.component';

describe('Component Tests', () => {
  describe('SysLog Management Update Component', () => {
    let comp: SysLogUpdateComponent;
    let fixture: ComponentFixture<SysLogUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let sysLogService: SysLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SysLogUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SysLogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SysLogUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      sysLogService = TestBed.inject(SysLogService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const sysLog: ISysLog = { id: 456 };

        activatedRoute.data = of({ sysLog });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sysLog));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SysLog>>();
        const sysLog = { id: 123 };
        jest.spyOn(sysLogService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ sysLog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sysLog }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(sysLogService.update).toHaveBeenCalledWith(sysLog);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SysLog>>();
        const sysLog = new SysLog();
        jest.spyOn(sysLogService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ sysLog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sysLog }));
        saveSubject.complete();

        // THEN
        expect(sysLogService.create).toHaveBeenCalledWith(sysLog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SysLog>>();
        const sysLog = { id: 123 };
        jest.spyOn(sysLogService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ sysLog });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(sysLogService.update).toHaveBeenCalledWith(sysLog);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
