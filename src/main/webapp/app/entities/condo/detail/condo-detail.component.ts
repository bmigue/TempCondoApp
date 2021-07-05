import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICondo } from '../condo.model';

@Component({
  selector: 'jhi-condo-detail',
  templateUrl: './condo-detail.component.html',
})
export class CondoDetailComponent implements OnInit {
  condo: ICondo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ condo }) => {
      this.condo = condo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
