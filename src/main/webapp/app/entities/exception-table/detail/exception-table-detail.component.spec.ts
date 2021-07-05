import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExceptionTableDetailComponent } from './exception-table-detail.component';

describe('Component Tests', () => {
  describe('ExceptionTable Management Detail Component', () => {
    let comp: ExceptionTableDetailComponent;
    let fixture: ComponentFixture<ExceptionTableDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ExceptionTableDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ exceptionTable: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ExceptionTableDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ExceptionTableDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load exceptionTable on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.exceptionTable).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
