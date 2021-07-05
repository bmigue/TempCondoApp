import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGeneralForum } from '../general-forum.model';

@Component({
  selector: 'jhi-general-forum-detail',
  templateUrl: './general-forum-detail.component.html',
})
export class GeneralForumDetailComponent implements OnInit {
  generalForum: IGeneralForum | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ generalForum }) => {
      this.generalForum = generalForum;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
