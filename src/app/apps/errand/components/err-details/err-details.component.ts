import { Component, OnInit } from '@angular/core';
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
export class ErrDetailsComponent implements OnInit {
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

  getUserProfile() {
    this.profileService.getRole().subscribe((res: any) => {
      this.user_type = res.role;
    });
  }

  getErrandDetails() {
    this.spinner.show();
    this._errandService
      .getErrandDetails(this.errandId)
      .subscribe((res: any) => {
        this.errand = res;
        this.spinner.hide();
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
    // this.isLoading = true;
    this.spinner.show();

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const phone_number = this.paymentForm.get('phoneNumber')?.value;
    const amount = this.errand.budget_amount;

    this._errandService
      .makePayment(this.errandId, { phone_number, amount })
      .subscribe({
        next: (res: any) => {
          console.log('Payment initiated:', res);
          // this.checkPaymentStatus(res.CheckoutRequestID);
          this.checkoutRequestId = res.CheckoutRequestID;
          this.spinner.hide();
        },
        error: (err) => {
          // this.isLoading = false;
          this.spinner.hide();
          console.error('Error initiating payment:', err);
          this._toastr.error('Something went wrong.');
        },
      });
  }

  checkPaymentStatus() {
    // this.isLoading = true;
    // this.spinner.show();

    const checkoutId = this.checkoutRequestId;
    const interval = setInterval(() => {
      this.attempts++;

      this._errandService
        .checkPaymentStatus(checkoutId)
        .subscribe((res: any) => {
          console.log('res', res);

          if (res.ResponseCode === '0') {
            // this.completed = true;
            clearInterval(interval);
          }

          if (res.ResponseCode && res.ResponseCode !== '0') {
            this.failed = true;
            this.failureReason = res.ResponseDesc || 'Payment failed';
            clearInterval(interval);
          }

          if (this.attempts >= this.maxAttempts) {
            this.failed = true;
            this.failureReason = 'Timed out waiting for confirmation';
            clearInterval(interval);
          }
        });
    }, 2000);
    // }
    // Implement payment status check logic here
    // this._errandService.checkPaymentStatus(checkoutId).subscribe({
    //   next: (res) => {
    //     console.log('Payment status:', res);
    //     this.isLoading = false;
    //     this.modalService.dismissAll();
    //   },
    //   error: (err) => {
    //     console.error('Error checking payment status:', err);
    //   }
    // });
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
