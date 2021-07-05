import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReservationService } from '../service/reservation.service';

import { ReservationComponent } from './reservation.component';

describe('Component Tests', () => {
  describe('Reservation Management Component', () => {
    let comp: ReservationComponent;
    let fixture: ComponentFixture<ReservationComponent>;
    let service: ReservationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReservationComponent],
      })
        .overrideTemplate(ReservationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReservationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ReservationService);

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
      expect(comp.reservations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
