import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CommonAreaService } from '../service/common-area.service';

import { CommonAreaComponent } from './common-area.component';

describe('Component Tests', () => {
  describe('CommonArea Management Component', () => {
    let comp: CommonAreaComponent;
    let fixture: ComponentFixture<CommonAreaComponent>;
    let service: CommonAreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommonAreaComponent],
      })
        .overrideTemplate(CommonAreaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommonAreaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CommonAreaService);

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
      expect(comp.commonAreas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
