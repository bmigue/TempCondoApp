import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SysLogDetailComponent } from './sys-log-detail.component';

describe('Component Tests', () => {
  describe('SysLog Management Detail Component', () => {
    let comp: SysLogDetailComponent;
    let fixture: ComponentFixture<SysLogDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SysLogDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ sysLog: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SysLogDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SysLogDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sysLog on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sysLog).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
