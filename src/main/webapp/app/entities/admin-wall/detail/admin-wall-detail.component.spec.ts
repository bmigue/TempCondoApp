import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdminWallDetailComponent } from './admin-wall-detail.component';

describe('Component Tests', () => {
  describe('AdminWall Management Detail Component', () => {
    let comp: AdminWallDetailComponent;
    let fixture: ComponentFixture<AdminWallDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AdminWallDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ adminWall: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AdminWallDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AdminWallDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load adminWall on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.adminWall).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
