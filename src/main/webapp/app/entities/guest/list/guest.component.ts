import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGuest } from '../guest.model';
import { GuestService } from '../service/guest.service';
import { GuestDeleteDialogComponent } from '../delete/guest-delete-dialog.component';

@Component({
  selector: 'jhi-guest',
  templateUrl: './guest.component.html',
})
export class GuestComponent implements OnInit {
  guests?: IGuest[];
  isLoading = false;

  constructor(protected guestService: GuestService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.guestService.query().subscribe(
      (res: HttpResponse<IGuest[]>) => {
        this.isLoading = false;
        this.guests = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGuest): number {
    return item.id!;
  }

  delete(guest: IGuest): void {
    const modalRef = this.modalService.open(GuestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.guest = guest;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
