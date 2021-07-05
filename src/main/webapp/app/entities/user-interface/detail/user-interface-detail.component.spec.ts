import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserInterfaceDetailComponent } from './user-interface-detail.component';

describe('Component Tests', () => {
  describe('UserInterface Management Detail Component', () => {
    let comp: UserInterfaceDetailComponent;
    let fixture: ComponentFixture<UserInterfaceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserInterfaceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ userInterface: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UserInterfaceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserInterfaceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userInterface on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userInterface).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
