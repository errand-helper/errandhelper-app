import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrandService } from '../../services/errand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../profile/services/profile.service';
import { Errand } from '../../models/errand.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-err-details',
  templateUrl: './err-details.component.html',
  styleUrl: './err-details.component.css',
})
export class ErrDetailsComponent implements OnInit, OnDestroy {
  errandId!: string;
  errand!: Errand;

  selectedImageIndex: number = 0;
  duration: number = 0;
  isLoading: boolean = false;

  actionLabel: string = '';
  user_type: string = '';
  selectedAction!:
    | 'accept'
    | 'reject'
    | 'completed'
    | 'cancel'
    | 'make_payment';
  paymentForm!: FormGroup;

  completed = false;
  failed = false;
  failureReason = '';
  attempts = 0;
  maxAttempts = 60;
  checkoutRequestId!: string;
  isReleasingEscrow = false;
  private paymentStatusInterval: ReturnType<typeof setInterval> | null = null;
  private isCheckingPaymentStatus = false;

  constructor(
    private readonly _errandService: ErrandService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly profileService: ProfileService,
    private readonly _toastr: ToastrService,
    private readonly fb: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.errandId = this.route.snapshot.paramMap.get('errand_id')!;

    this.getErrandDetails();
    this.getUserProfile();

    this.paymentForm = this.fb.group({
      phoneNumber: ['', Validators.required],
    });

  }

  ngOnDestroy(): void {
    this.clearPaymentStatusInterval();
  }

  getUserProfile() {
    this.profileService.getRole().subscribe((res: any) => {
      this.user_type = res.role;
    });
  }

  getErrandDetails() {
    this.spinner.show();
    this._errandService
      .getErrandDetails(this.errandId)
      .subscribe({
        next: (res: any) => {
          this.errand = res;
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
        },
      });
  }

  canReleaseEscrow(): boolean {
    return (
      this.user_type === 'client' &&
      !!this.errand?.paid &&
      this.errand?.status === 'completed'
    );
  }

  releaseEscrowPayment(): void {
    if (!this.canReleaseEscrow() || this.isReleasingEscrow) {
      return;
    }

    this.isReleasingEscrow = true;
    this.spinner.show();

    this._errandService.releaseEscrow(this.errandId).subscribe({
      next: (res: any) => {
        this._toastr.success(res?.status === 'already_released' ? 'Funds were already released.' : 'Escrow released successfully.');
        this.getErrandDetails();
      },
      error: (err) => {
        const message =
          err?.error?.detail || 'Failed to release escrow. Please try again.';
        this._toastr.error(message);
      },
      complete: () => {
        this.isReleasingEscrow = false;
        this.spinner.hide();
      },
    });
  }

  getDuration(start: string | undefined, end: string | undefined): string {
    if (!start || !end) return '—';

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();

    if (diffMs <= 0) return '0 min';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hr${
        diffHours > 1 ? 's' : ''
      }`;
    } else if (diffHours > 0) {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''} ${diffMinutes} min${
        diffMinutes > 1 ? 's' : ''
      }`;
    } else {
      return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''}`;
    }
  }

  acceptRejectErrand(
    action: 'accept' | 'reject' | 'completed' | 'cancel' | 'make_payment',
    content: any
  ): void {
    this.selectedAction = action;
    this.actionLabel = this.getActionLabel(action);
    this.modalService.open(content, { centered: true });
  }

  // makePayment(action: 'make_payment', content1: any): void {
  //   this.actionLabel = this.getActionLabel(action);
  //   this.modalService.open(content1, { centered: true });
  // }

  private getActionLabel(action: string): string {
    const labelMap: { [key: string]: string } = {
      accept: 'Accept Errand',
      reject: 'Reject Errand',
      completed: 'Mark as Completed',
      make_payment: 'Make Payment',
      cancelled: 'Cancel Errand',
    };
    return labelMap[action] || 'Cancel Errand';
  }

  initiatePayment() {
    this.spinner.show();

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }

    this.failed = false;
    this.failureReason = '';
    this.attempts = 0;

    const phone_number = this.paymentForm.get('phoneNumber')?.value;
    const amount = this.errand.budget_amount;

    this._errandService
      .makePayment(this.errandId, { phone_number, amount })
      .subscribe({
        next: (res: any) => {
          console.log('Payment initiated:', res);
          this.checkoutRequestId = res.CheckoutRequestID;
          this.checkPaymentStatus();
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error initiating payment:', err);
          this.failed = true;
          this.failureReason = 'Error initiating payment';
          this._toastr.error(this.failureReason);
        },
      });
  }

  checkPaymentStatus() {
    this.clearPaymentStatusInterval();

    this.paymentStatusInterval = setInterval(() => {
      if (this.isCheckingPaymentStatus) {
        return;
      }

      this.attempts++;
      this.isCheckingPaymentStatus = true;
      this._errandService
        .checkPaymentStatus(this.checkoutRequestId)
        .subscribe({
          next: (res: any) => {
            this.isCheckingPaymentStatus = false;
            console.log('res', res);

            if (res.ResultCode === '0') {
              this._toastr.success(res.ResultDesc);
              this.clearPaymentStatusInterval();
              this.spinner.hide();
              this.getErrandDetails();
              return;
            }

            if (res.ResultCode && res.ResultCode !== '0') {
              this.failed = true;
              this.failureReason = res.ResponseDesc || 'Payment failed';
              this.clearPaymentStatusInterval();
              this.spinner.hide();
              this._toastr.error(this.failureReason);
              return;
            }

            if (this.attempts >= this.maxAttempts) {
              this.failed = true;
              this.failureReason = 'Timed out waiting for confirmation';
              this.clearPaymentStatusInterval();
              this.spinner.hide();
              this._toastr.error(this.failureReason);
            }
          },
          error: (err) => {
            this.isCheckingPaymentStatus = false;
            this.failed = true;
            this.failureReason = 'Error checking payment status';
            this.clearPaymentStatusInterval();
            this.spinner.hide();
            this._toastr.error(this.failureReason);
            console.error('Error checking payment status:', err);
          },
        });
    }, 2000);
  }

  private clearPaymentStatusInterval(): void {
    if (this.paymentStatusInterval) {
      clearInterval(this.paymentStatusInterval);
      this.paymentStatusInterval = null;
    }
    this.isCheckingPaymentStatus = false;
  }

  confirmAction() {
    this.isLoading = true;

    console.log(this.errandId, this.selectedAction);

    this._errandService
      .acceptOrRejectErrand(this.errandId, this.selectedAction)
      .subscribe({
        next: (res) => {
          console.log('Errand updated:', res);
          this.isLoading = false;
          this.modalService.dismissAll();
          this.getErrandDetails();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error updating errand:', err);
          this._toastr.error('Something went wrong.');
        },
      });
    // }
  }

  navigateBack() {
    window.history.back();
  }

  editErrand() {
    // Navigate to the errand edit page
    this.router.navigate([
      `/errands/edit/${this.errand.business_id}/${this.errandId}`,
    ]);
  }
}
