import { Component } from '@angular/core';
import { ErrandService } from '../../services/errand.service';
import { ActivatedRoute } from '@angular/router';

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
  businessId!: string;
  errand!: Errand;

  selectedImageIndex: number = 0;
  duration: number = 0;
  isLoading: boolean = false;

  constructor(
    private _errandService: ErrandService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.calculateDuration();
    this.businessId = this.route.snapshot.paramMap.get('errand_id')!;

    this.getErrandDetails();
  }

  getErrandDetails() {
    this.isLoading = true;
    this._errandService
      .getErrandDetails(this.businessId)
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

  calculateDuration(): void {
    const start = new Date(this.errand.start_date);
    const end = new Date(this.errand.stop_date);
    this.duration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount: number | string): string {
    return parseFloat(amount.toString()).toLocaleString();
  }

  getTotalMilestones(): number {
    return this.errand.milestones.reduce((sum, m) => sum + m.amount, 0);
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'status-pending',
      active: 'status-active',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return classes[status] || classes['pending'];
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      low: 'priority-low',
      normal: 'priority-normal',
      high: 'priority-high',
      urgent: 'priority-urgent',
    };
    return classes[priority] || classes['normal'];
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  navigateBack() {
    window.history.back();
  }
}
