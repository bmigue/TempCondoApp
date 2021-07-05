import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SysLogService } from '../service/sys-log.service';

import { SysLogComponent } from './sys-log.component';

describe('Component Tests', () => {
  describe('SysLog Management Component', () => {
    let comp: SysLogComponent;
    let fixture: ComponentFixture<SysLogComponent>;
    let service: SysLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SysLogComponent],
      })
        .overrideTemplate(SysLogComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SysLogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SysLogService);

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
      expect(comp.sysLogs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
