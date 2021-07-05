import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExceptionTableService } from '../service/exception-table.service';

import { ExceptionTableComponent } from './exception-table.component';

describe('Component Tests', () => {
  describe('ExceptionTable Management Component', () => {
    let comp: ExceptionTableComponent;
    let fixture: ComponentFixture<ExceptionTableComponent>;
    let service: ExceptionTableService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExceptionTableComponent],
      })
        .overrideTemplate(ExceptionTableComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExceptionTableComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ExceptionTableService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.exceptionTables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
