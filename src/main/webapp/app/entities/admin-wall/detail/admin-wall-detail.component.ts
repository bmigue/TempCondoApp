import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdminWall } from '../admin-wall.model';

@Component({
  selector: 'jhi-admin-wall-detail',
  templateUrl: './admin-wall-detail.component.html',
})
export class AdminWallDetailComponent implements OnInit {
  adminWall: IAdminWall | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adminWall }) => {
      this.adminWall = adminWall;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
