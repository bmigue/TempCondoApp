import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommonArea } from '../common-area.model';

@Component({
  selector: 'jhi-common-area-detail',
  templateUrl: './common-area-detail.component.html',
})
export class CommonAreaDetailComponent implements OnInit {
  commonArea: ICommonArea | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commonArea }) => {
      this.commonArea = commonArea;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
