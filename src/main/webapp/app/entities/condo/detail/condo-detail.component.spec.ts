import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CondoDetailComponent } from './condo-detail.component';

describe('Component Tests', () => {
  describe('Condo Management Detail Component', () => {
    let comp: CondoDetailComponent;
    let fixture: ComponentFixture<CondoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CondoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ condo: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CondoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CondoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load condo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.condo).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
