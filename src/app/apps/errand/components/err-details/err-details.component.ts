import { Component } from '@angular/core';
import { ErrandService } from '../../services/errand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../profile/services/profile.service';
import { Errand } from '../../models/errand.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-err-details',
  templateUrl: './err-details.component.html',
  styleUrl: './err-details.component.css',
})
export class ErrDetailsComponent {
  errandId!: string;
  errand!: Errand;

  selectedImageIndex: number = 0;
  duration: number = 0;
  isLoading: boolean = false;

  actionLabel: string = '';
  user_type: string = '';
  selectedAction!: 'accept' | 'reject'  | 'completed' | 'cancelled';

  constructor(
    private readonly _errandService: ErrandService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.errandId = this.route.snapshot.paramMap.get('errand_id')!;

    this.getErrandDetails();
    this.getUserProfile();
  }

  getUserProfile() {
    this.profileService.getRole().subscribe((res: any) => {
      this.user_type = res.role;
    });
  }

  getErrandDetails() {
    this.isLoading = true;
    this._errandService
      .getErrandDetails(this.errandId)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.errand = res;
        console.log(this.errand);
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

  acceptRejectErrand(action: 'accept' | 'reject' | 'completed' | 'cancelled', content: any): void {
    this.selectedAction = action;
    this.actionLabel = action === 'accept' ? 'Accept Errand' : action === 'reject' ? 'Reject Errand' : action === 'completed' ? 'Mark as Completed' : 'Cancel Errand';
    this.modalService.open(content, { centered: true });
  }

  confirmAction() {
    this.isLoading = true;

    console.log(this.errandId, this.selectedAction);


    this._errandService
      .acceptOrRejectErrand(this.errandId, this.selectedAction)
      .subscribe({
        next: (res) => {
          console.log('✅ Errand updated:', res);
          this.isLoading = false;
          this.modalService.dismissAll();
          this.getErrandDetails();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('❌ Error updating errand:', err);
          this._toastr.error('Something went wrong.');
        },
      });
  }


  navigateBack() {
    window.history.back();
  }

  editErrand() {
    // Navigate to the errand edit page
    this.router.navigate([`/errands/edit/${this.errand.business_id}/${this.errandId}`]);
  }
}
