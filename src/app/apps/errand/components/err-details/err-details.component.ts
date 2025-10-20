import { Component } from '@angular/core';

interface Location {
  address: string;
  town: string;
  location: string;
  city: string;
}

interface Image {
  id: number;
  image_url: string;
  uploaded_at: string;
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
  locations: Location[];
  images: Image[];
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
  styleUrl: './err-details.component.css'
})
export class ErrDetailsComponent {

  errand: Errand = {
    id: "5efeca44-4527-4d5a-a228-2a1239f291ce",
    locations: [
      { address: "", town: "Westlands Town", location: "", city: "Nairobi city" },
      { address: "", town: "Thika town", location: "", city: "Nairobi City" },
      { address: "", town: "CBD", location: "", city: "Nairobi" }
    ],
    images: [
      { id: 12, image_url: "https://erranddocs.s3.amazonaws.com/errands/81ed8961-0957-44db-8d57-aade0a2eeb5f.jpg", uploaded_at: "2025-10-20T07:40:09.880591Z" },
      { id: 13, image_url: "https://erranddocs.s3.amazonaws.com/errands/20618e23-9052-421c-af55-333510fd4a38.jpg", uploaded_at: "2025-10-20T07:40:11.327036Z" }
    ],
    start_date: "2025-10-21T10:38:00Z",
    stop_date: "2025-10-22T10:38:00Z",
    reference_number: "202510200740087RB",
    errand_title: "Grocery Shopping",
    descriptions: ["Instructions 1", "Instructions 2", "Instructions 3"],
    priority: "normal",
    budget_type: "fixed",
    budget_amount: "10000.00",
    estimated_hours: 20,
    use_milestones: true,
    payment_method: "card",
    special_instructions: "To be done by end of day",
    contact_preference: "platform",
    agree_terms: true,
    agree_escrow: true,
    services: [
      { id: 1, name: "Grocery Shopping", description: "Food and household items", category: "Delivery" },
      { id: 2, name: "Pharmacy Run", description: "Medicine and health products", category: "Shopping" }
    ],
    milestones: [
      { description: "mileston 1", amount: 5000 },
      { description: "mileston 2", amount: 3000 },
      { description: "milestone 3", amount: 2000 }
    ],
    status: "pending",
    created_at: "2025-10-20T07:40:08.382383Z",
    updated_at: "2025-10-20T07:40:08.382386Z",
    client: "0d5d11b6-3fce-4937-bb77-5df7850b99ef",
    business: "baf2357c-57de-44d2-89d9-b7799fea72be"
  };

  selectedImageIndex: number = 0;
  duration: number = 0;

  ngOnInit(): void {
    this.calculateDuration();
  }

  calculateDuration(): void {
    const start = new Date(this.errand.start_date);
    const end = new Date(this.errand.stop_date);
    this.duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      'pending': 'status-pending',
      'active': 'status-active',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || classes['pending'];
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'low': 'priority-low',
      'normal': 'priority-normal',
      'high': 'priority-high',
      'urgent': 'priority-urgent'
    };
    return classes[priority] || classes['normal'];
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }


}
