import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GeneralForumDetailComponent } from './general-forum-detail.component';

describe('Component Tests', () => {
  describe('GeneralForum Management Detail Component', () => {
    let comp: GeneralForumDetailComponent;
    let fixture: ComponentFixture<GeneralForumDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GeneralForumDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ generalForum: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GeneralForumDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GeneralForumDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load generalForum on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.generalForum).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
