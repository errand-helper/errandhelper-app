import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  createErrandForm!:FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploadedFiles: File[] = [];

  serviceFee = 0;
  platformFee = 0;
  urgencyFee = 0;
  totalAmount = 0;

  useMilestones = false;
  // milestones:any;

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
    this.createErrandForm.patchValue({ paymentMethod: method });
    // console.log(this.selectedPayment);

  }

    constructor(private fb: FormBuilder) {}



  ngOnInit(): void {
    this.updateCostSummary();

     this.createErrandForm = this.fb.group({
      errandTitle: ['', Validators.required],
      descriptions: this.fb.array([]),
      // errandDescription: ['', Validators.required],
      errandAddress: ['', Validators.required],
      errandDate: ['', Validators.required],
      errandTime: ['', Validators.required],
      flexibleSchedule: [false],
      priority: ['normal', Validators.required],
      budgetType: ['fixed', Validators.required],
      budgetAmount: [null],
      estimatedHours: [null],
      milestones: this.fb.array([]),
      useMilestones: [false],
      paymentMethod: ['', Validators.required],
      specialInstructions: [''],
      contactPreference: ['platform'],
      agreeTerms: [false, Validators.requiredTrue],
      agreeEscrow: [false, Validators.requiredTrue]
    });
  }

  get milestones(): FormArray {
    return this.createErrandForm.get('milestones') as FormArray;
  }

  //  get descriptions(): FormArray {
  //   return this.createErrandForm.get('descriptions') as FormArray;
  // }

   addMilestone(): void {
    const milestoneGroup = this.fb.group({
      description: [''],
      amount: [0]
    });
    this.milestones.push(milestoneGroup);
  }

  removeMilestone(index: number): void {
    this.milestones.removeAt(index);
  }

get descriptions(): FormArray {
    return this.createErrandForm.get('descriptions') as FormArray;
  }

  addItem() {
    this.descriptions.push(new FormControl(''));
  }

  removeItem(index: number) {
    this.descriptions.removeAt(index);
  }

  get itemCount(): number {
    return this.descriptions.length;
  }

  asFormControl(control: any): FormControl {
    return control as FormControl;
  }






  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files ? Array.from(target.files) : [];
    this.uploadedFiles.push(...files);
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer ? Array.from(event.dataTransfer.files) : [];
    this.uploadedFiles.push(...files);
  }


  selectPriority(priority: string) {
    this.selectedPriority = priority;
    this.updateCostSummary();
  }




  // addMilestone() {
  //   this.milestones.push({ description: '', amount: null });
  // }

  // removeMilestone(index: number) {
  //   this.milestones.splice(index, 1);
  // }



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

  //  removeMilestone(index: number): void {
  //   this.milestones.removeAt(index);
  // }



  toggleMilestones(): void {
    this.useMilestones = !this.useMilestones;
    this.createErrandForm.patchValue({ useMilestones: this.useMilestones });
  }


  /** Submit form */
  onSubmit(): void {
    if (this.createErrandForm.valid) {
      console.log('Form submitted:', this.createErrandForm.value);
      // alert('Errand submitted successfully!');
    } else {
      this.createErrandForm.markAllAsTouched();
            console.log('Form submitted:', this.createErrandForm.value);

      // alert('Please complete all required fields.');
    }
  }

  saveDraft(): void {
    console.log('Draft saved:', this.createErrandForm.value);
    alert('Draft saved successfully!');
  }

  navigateBack() {
    window.history.back();
  }
}

