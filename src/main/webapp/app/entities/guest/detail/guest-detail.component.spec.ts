import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GuestDetailComponent } from './guest-detail.component';

describe('Component Tests', () => {
  describe('Guest Management Detail Component', () => {
    let comp: GuestDetailComponent;
    let fixture: ComponentFixture<GuestDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GuestDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ guest: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GuestDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GuestDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load guest on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.guest).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
