import { Component } from '@angular/core';
import { ErrandService } from '../../services/errand.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../profile/services/profile.service';

interface Location {
  address: string;
  town: string;
  location: string;
  city: string;
}

interface Image {
  id: number;
  image_url?: string;
  uploaded_at?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface Milestone {
  description: string;
  amount: number;
}

interface Errand {
  id: string;
  locations?: Location[];
  images?: Image[];
  start_date: string;
  stop_date: string;
  reference_number: string;
  errand_title: string;
  descriptions: string[];
  priority: string;
  budget_type: string;
  budget_amount: string;
  estimated_hours: number;
  use_milestones: boolean;
  payment_method: string;
  special_instructions: string;
  contact_preference: string;
  agree_terms: boolean;
  agree_escrow: boolean;
  services: Service[];
  milestones: Milestone[];
  status: string;
  created_at: string;
  updated_at: string;
  client: string;
  business: string;
}

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
    private _errandService: ErrandService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private profileService: ProfileService
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
        // console.log(this.errand);
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
    this.actionLabel = action === 'accept' ? 'Accept Errand' : 'Reject Errand';
    this.modalService.open(content, { centered: true });
  }

  confirmAction() {
    this.isLoading = true;

    this._errandService
      .acceptOrRejectErrand(this.errandId, this.selectedAction)
      .subscribe({
        next: (res) => {
          console.log('✅ Errand updated:', res);
          this.getErrandDetails();
        },
        error: (err) => {
          // this.toast.error('Something went wrong.');
        },
      });
  }


  navigateBack() {
    window.history.back();
  }
}
