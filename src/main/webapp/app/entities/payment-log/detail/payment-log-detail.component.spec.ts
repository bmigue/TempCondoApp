import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentLogDetailComponent } from './payment-log-detail.component';

describe('Component Tests', () => {
  describe('PaymentLog Management Detail Component', () => {
    let comp: PaymentLogDetailComponent;
    let fixture: ComponentFixture<PaymentLogDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentLogDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ paymentLog: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PaymentLogDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaymentLogDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load paymentLog on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.paymentLog).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
