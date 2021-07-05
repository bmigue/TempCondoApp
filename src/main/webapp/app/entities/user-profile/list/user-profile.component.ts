import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';
import { UserProfileDeleteDialogComponent } from '../delete/user-profile-delete-dialog.component';

@Component({
  selector: 'jhi-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  userProfiles?: IUserProfile[];
  isLoading = false;

  constructor(protected userProfileService: UserProfileService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userProfileService.query().subscribe(
      (res: HttpResponse<IUserProfile[]>) => {
        this.isLoading = false;
        this.userProfiles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserProfile): number {
    return item.id!;
  }

  delete(userProfile: IUserProfile): void {
    const modalRef = this.modalService.open(UserProfileDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userProfile = userProfile;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
