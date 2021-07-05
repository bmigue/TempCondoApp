import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GeneralForumService } from '../service/general-forum.service';

import { GeneralForumComponent } from './general-forum.component';

describe('Component Tests', () => {
  describe('GeneralForum Management Component', () => {
    let comp: GeneralForumComponent;
    let fixture: ComponentFixture<GeneralForumComponent>;
    let service: GeneralForumService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GeneralForumComponent],
      })
        .overrideTemplate(GeneralForumComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GeneralForumComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(GeneralForumService);

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
      expect(comp.generalForums?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
