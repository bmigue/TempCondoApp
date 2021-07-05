import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommonAreaDetailComponent } from './common-area-detail.component';

describe('Component Tests', () => {
  describe('CommonArea Management Detail Component', () => {
    let comp: CommonAreaDetailComponent;
    let fixture: ComponentFixture<CommonAreaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CommonAreaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ commonArea: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CommonAreaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CommonAreaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load commonArea on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.commonArea).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
