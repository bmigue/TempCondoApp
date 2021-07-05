import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GuestService } from '../service/guest.service';

import { GuestComponent } from './guest.component';

describe('Component Tests', () => {
  describe('Guest Management Component', () => {
    let comp: GuestComponent;
    let fixture: ComponentFixture<GuestComponent>;
    let service: GuestService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GuestComponent],
      })
        .overrideTemplate(GuestComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GuestComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(GuestService);

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
      expect(comp.guests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
