import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserProfileService } from '../service/user-profile.service';

import { UserProfileComponent } from './user-profile.component';

describe('Component Tests', () => {
  describe('UserProfile Management Component', () => {
    let comp: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    let service: UserProfileService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserProfileComponent],
      })
        .overrideTemplate(UserProfileComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserProfileComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UserProfileService);

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
      expect(comp.userProfiles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
