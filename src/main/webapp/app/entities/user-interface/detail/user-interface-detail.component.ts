import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserInterface } from '../user-interface.model';

@Component({
  selector: 'jhi-user-interface-detail',
  templateUrl: './user-interface-detail.component.html',
})
export class UserInterfaceDetailComponent implements OnInit {
  userInterface: IUserInterface | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userInterface }) => {
      this.userInterface = userInterface;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
