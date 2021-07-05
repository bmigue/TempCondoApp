import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CondoService } from '../service/condo.service';

import { CondoComponent } from './condo.component';

describe('Component Tests', () => {
  describe('Condo Management Component', () => {
    let comp: CondoComponent;
    let fixture: ComponentFixture<CondoComponent>;
    let service: CondoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CondoComponent],
      })
        .overrideTemplate(CondoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CondoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CondoService);

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
      expect(comp.condos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
