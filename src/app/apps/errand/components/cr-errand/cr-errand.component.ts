import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cr-errand',
  templateUrl: './cr-errand.component.html',
  styleUrl: './cr-errand.component.css',
})
export class CrErrandComponent implements OnInit {
  selectedPriority: string = '';
  budgetAmount: number = 0;
  selectedBudgetType: string = '';
  estimatedHours: number = 0;

  serviceFee = 0;
  platformFee = 0;
  urgencyFee = 0;
  totalAmount = 0;

  useMilestones = false;
  milestones = [
    { description: '', amount: null }
  ];

  selectedPayment: string = '';

  paymentMethods = [
    {
      id: 'card',
      label: 'Credit Card',
      detail: '•••• 4242',
      icon: 'fas fa-credit-card',
      color: 'var(--primary-blue)'
    },
    {
      id: 'paypal',
      label: 'PayPal',
      detail: 'johnexample.com',
      icon: 'fab fa-paypal',
      color: '#0070ba'
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      detail: '•••• 5678',
      icon: 'fas fa-university',
      color: 'var(--primary-blue)'
    }
  ];

  selectPayment(method: string) {
    this.selectedPayment = method;
  }


  ngOnInit(): void {
    this.updateCostSummary();
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
    this.updateCostSummary();
  }


  addMilestone() {
    this.milestones.push({ description: '', amount: null });
  }

  removeMilestone(index: number) {
    this.milestones.splice(index, 1);
  }



  selectBudgetType(type: string) {
    this.selectedBudgetType = type;
  }

  updateCostSummary() {
    const budget = this.budgetAmount || 0;

    this.serviceFee = budget;
    this.platformFee = budget * 0.05;

    if (this.selectedPriority === 'urgent') {
      this.urgencyFee = budget * 0.15;
    } else if (this.selectedPriority === 'emergency') {
      this.urgencyFee = budget * 0.25;
    } else {
      this.urgencyFee = 0;
    }

    this.totalAmount = budget + this.platformFee + this.urgencyFee;
  }

  submitForm() {
    if (!this.selectedPriority) {
      alert('Please select a priority level');
      return;
    }

    if (!this.budgetAmount) {
      alert('Please enter a budget amount');
      return;
    }

    alert('Errand request submitted successfully!');
    // Here you’d send data to your API
  }

  navigateBack() {
    window.history.back();
  }
}
