import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { ReservationDeleteDialogComponent } from '../delete/reservation-delete-dialog.component';

@Component({
  selector: 'jhi-reservation',
  templateUrl: './reservation.component.html',
})
export class ReservationComponent implements OnInit {
  reservations?: IReservation[];
  isLoading = false;

  constructor(protected reservationService: ReservationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.reservationService.query().subscribe(
      (res: HttpResponse<IReservation[]>) => {
        this.isLoading = false;
        this.reservations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IReservation): number {
    return item.id!;
  }

  delete(reservation: IReservation): void {
    const modalRef = this.modalService.open(ReservationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reservation = reservation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
