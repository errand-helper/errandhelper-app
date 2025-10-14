import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BusinessService } from '../../../business/services/business.service';
import { ActivatedRoute } from '@angular/router';
import { ErrandService } from '../../services/errand.service';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  selected?: boolean;
}

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

  selectedCategory = 'All Services';
  searchTerm = '';
  services: any[] = [];

  createErrandForm!: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploadedFiles: File[] = [];

  serviceFee = 0;
  platformFee = 0;
  urgencyFee = 0;
  totalAmount = 0;
  isUrgent: boolean = false;

  useMilestones = false;
  business_details: any;
  // milestones:any;

  selectedPayment: string = '';
  businessId!: string;

  paymentMethods = [
    {
      id: 'card',
      label: 'Credit Card',
      detail: '•••• 4242',
      icon: 'fas fa-credit-card',
      color: 'var(--primary-blue)',
    },
    {
      id: 'paypal',
      label: 'PayPal',
      detail: 'johnexample.com',
      icon: 'fab fa-paypal',
      color: '#0070ba',
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      detail: '•••• 5678',
      icon: 'fas fa-university',
      color: 'var(--primary-blue)',
    },
  ];

  selectPayment(method: string) {
    this.selectedPayment = method;
    this.createErrandForm.patchValue({ paymentMethod: method });
    // console.log(this.selectedPayment);
  }

  constructor(
    private fb: FormBuilder,
    private _businessService: BusinessService,
    private route: ActivatedRoute,
    private _errandService: ErrandService
  ) {}

  validateLocations(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as any;
      if (
        !formArray ||
        !formArray.controls ||
        formArray.controls.length === 0
      ) {
        return { required: true };
      }

      const invalid = formArray.controls.some(
        (loc: AbstractControl) => loc.invalid
      );
      return invalid ? { invalidLocation: true } : null;
    };
  }

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('business_id')!;

    // this.updateCostSummary();
    this.getBusinessInfo();

    this.createErrandForm = this.fb.group({
      errandTitle: ['', Validators.required],
      descriptions: this.fb.array([]),
      locations: this.fb.array([this.createLocation()], {
        validators: [this.validateLocations()],
      }),
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
      agreeEscrow: [false, Validators.requiredTrue],
      startDate: ['', Validators.required],
      stopDate: ['', Validators.required],
    });

    this.createErrandForm.valueChanges.subscribe(() => {
      this.updateCostSummary();
    });
  }

  getBusinessInfo() {
    this._businessService
      .getBusinessLiteDetail(this.businessId)
      .subscribe((res: any) => {
        this.business_details = res;
        this.services = this.business_details?.services || [];
        // this.categories = ['All Services', ...new Set(this.services.map((s) => s.category))];
        console.log('this.business_details', this.business_details);
      });
  }

  get filteredServices() {
    return this.services.filter((service) => {
      const matchesCategory =
        this.selectedCategory === 'All Services' ||
        service.category === this.selectedCategory;
      const matchesSearch = service.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  get milestones(): FormArray {
    return this.createErrandForm.get('milestones') as FormArray;
  }

  get descriptions(): FormArray {
    return this.createErrandForm.get('descriptions') as FormArray;
  }

  addMilestone(): void {
    const milestoneGroup = this.fb.group({
      description: [''],
      amount: [0],
    });
    this.milestones.push(milestoneGroup);
  }

  removeMilestone(index: number): void {
    this.milestones.removeAt(index);
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

  get locations(): FormArray {
    return this.createErrandForm.get('locations') as FormArray;
  }

  createLocation(): FormGroup {
    return this.fb.group({
      city: ['', Validators.required],
      town: ['', Validators.required],
      streetAddress: ['', Validators.required],
    });
  }

  addLocation(): void {
    this.locations.push(this.createLocation());
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  toggleCategory(category: string) {
    this.selectedCategory = category;
  }

  toggleSelection(service: Service) {
    service.selected = !service.selected;
  }

  get selectedCount() {
    return this.services.filter((s) => s.selected).length;
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
    const files = event.dataTransfer
      ? Array.from(event.dataTransfer.files)
      : [];
    this.uploadedFiles.push(...files);
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
    this.updateCostSummary();
  }

  selectBudgetType(type: string) {
    this.selectedBudgetType = type;
  }

  updateCostSummary() {
    // const budget = Number(this.budgetAmount) || 0;
    const budget = Number(this.createErrandForm.value.budgetAmount) || 0;
    this.serviceFee = budget;
    this.platformFee = budget * 0.05;

    console.log(budget);

    if (this.selectedPriority === 'urgent') {
      this.urgencyFee = budget * 0.05;
    } else if (this.selectedPriority === 'emergency') {
      this.urgencyFee = budget * 0.1;
    } else {
      this.urgencyFee = 0;
    }

    this.totalAmount = budget + this.platformFee + this.urgencyFee;
  }

  toggleMilestones(): void {
    this.useMilestones = !this.useMilestones;
    this.createErrandForm.patchValue({ useMilestones: this.useMilestones });
  }

  /** Submit form */
  onSubmit(): void {
    if (this.createErrandForm.valid) {
      const formData = new FormData();
      const formValue = this.createErrandForm.value;

      formData.append('errand_title', this.createErrandForm.value.errandTitle);
      formData.append('priority', this.createErrandForm.value.priority);
      formData.append('budget_type', this.createErrandForm.value.budgetType);
      formData.append('business', this.business_details.user);
      formData.append(
        'budget_amount',
        this.createErrandForm.value.budgetAmount || 0
      );
      formData.append(
        'estimated_hours',
        this.createErrandForm.value.estimatedHours
      );
      formData.append(
        'use_milestones',
        this.createErrandForm.value.useMilestones
      );
      formData.append(
        'payment_method',
        this.createErrandForm.value.paymentMethod
      );
      formData.append(
        'special_instructions',
        this.createErrandForm.value.specialInstructions || ''
      );
      formData.append(
        'contact_preference',
        this.createErrandForm.value.contactPreference
      );
      formData.append('agree_terms', this.createErrandForm.value.agreeTerms);
      formData.append('agree_escrow', this.createErrandForm.value.agreeEscrow);
      formData.append(
        'estimated_hours',
        this.createErrandForm.value.estimatedHours || 0
      );
      formData.append(`start_date`, this.createErrandForm.value.startDate);
      formData.append(`stop_date`, this.createErrandForm.value.stopDate);

      formData.append('descriptions', JSON.stringify(formValue.descriptions));
      formData.append('locations', JSON.stringify(formValue.locations));
      formData.append('milestones', JSON.stringify(formValue.milestones));

      this.uploadedFiles.forEach((file: File) => {
        formData.append('images', file);
      });
      this._errandService.createNewErrand(formData).subscribe((res: any) => {
        console.log(res);
      });
    } else {
      this.createErrandForm.markAllAsTouched();
      console.log('Form submitted:', this.createErrandForm.value);
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
