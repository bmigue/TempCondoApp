import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CheckLogService } from '../service/check-log.service';

import { CheckLogComponent } from './check-log.component';

describe('Component Tests', () => {
  describe('CheckLog Management Component', () => {
    let comp: CheckLogComponent;
    let fixture: ComponentFixture<CheckLogComponent>;
    let service: CheckLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CheckLogComponent],
      })
        .overrideTemplate(CheckLogComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CheckLogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CheckLogService);

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
      expect(comp.checkLogs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
