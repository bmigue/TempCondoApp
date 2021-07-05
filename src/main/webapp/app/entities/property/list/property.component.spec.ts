import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PropertyService } from '../service/property.service';

import { PropertyComponent } from './property.component';

describe('Component Tests', () => {
  describe('Property Management Component', () => {
    let comp: PropertyComponent;
    let fixture: ComponentFixture<PropertyComponent>;
    let service: PropertyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PropertyComponent],
      })
        .overrideTemplate(PropertyComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PropertyComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PropertyService);

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
      expect(comp.properties?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
