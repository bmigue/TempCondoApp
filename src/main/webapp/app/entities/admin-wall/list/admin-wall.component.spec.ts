import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AdminWallService } from '../service/admin-wall.service';

import { AdminWallComponent } from './admin-wall.component';

describe('Component Tests', () => {
  describe('AdminWall Management Component', () => {
    let comp: AdminWallComponent;
    let fixture: ComponentFixture<AdminWallComponent>;
    let service: AdminWallService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AdminWallComponent],
      })
        .overrideTemplate(AdminWallComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdminWallComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AdminWallService);

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
      expect(comp.adminWalls?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
