import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CheckLogDetailComponent } from './check-log-detail.component';

describe('Component Tests', () => {
  describe('CheckLog Management Detail Component', () => {
    let comp: CheckLogDetailComponent;
    let fixture: ComponentFixture<CheckLogDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CheckLogDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ checkLog: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CheckLogDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CheckLogDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load checkLog on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.checkLog).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
