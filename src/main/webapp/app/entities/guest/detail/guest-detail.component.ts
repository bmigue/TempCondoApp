import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGuest } from '../guest.model';

@Component({
  selector: 'jhi-guest-detail',
  templateUrl: './guest-detail.component.html',
})
export class GuestDetailComponent implements OnInit {
  guest: IGuest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ guest }) => {
      this.guest = guest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
