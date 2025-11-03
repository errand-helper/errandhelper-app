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
import { ActivatedRoute, Route, Router } from '@angular/router';
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
  uploadedFiles: any;

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
    {
      id: 'platform',
      label: 'Platform',
      detail: '•••• 5678',
      icon: 'fas fa-university',
      color: 'var(--primary-blue)',
    },
  ];

  service_ids = [];

  selectPayment(method: string) {
    this.selectedPayment = method;
    this.createErrandForm.patchValue({ paymentMethod: method });
  }

  isMilestoneTotalCorrect = false;

  isLoading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private _businessService: BusinessService,
    private route: ActivatedRoute,
    private _router: Router,
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
      images: this.fb.array([]),
    });

    this.createErrandForm.valueChanges.subscribe(() => {
      this.updateCostSummary();
    });

    // this.milestones.valueChanges.subscribe(() => this.checkTotalBudget());
    this.milestones.valueChanges.subscribe(() => this.checkTotalBudget());
    this.createErrandForm.get('budgetAmount')?.valueChanges.subscribe(() => this.checkTotalBudget());
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  getBusinessInfo() {
    this._businessService
      .getBusinessLiteDetail(this.businessId)
      .subscribe((res: any) => {
        this.business_details = res;
        this.services = this.business_details?.services || [];
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

  addMilestone() {
    const milestoneGroup = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });

    milestoneGroup.valueChanges.subscribe(() => this.checkTotalBudget());
    this.milestones.push(milestoneGroup);
  }


  // addMilestone(): void {
  //   const milestoneGroup = this.fb.group({
  //     description: [''],
  //     amount: [0],
  //   });
  //   this.milestones.push(milestoneGroup);
  // }

  removeMilestone(index: number) {
    this.milestones.removeAt(index);
    this.checkTotalBudget();
  }

  checkTotalBudget() {
    const budgetAmount = Number(this.createErrandForm.get('budgetAmount')?.value || 0);
    const totalMilestoneAmount = this.milestones.value
      .map((m: any) => Number(m.amount) || 0)
      .reduce((a: number, b: number) => a + b, 0);

    //  Update flag
    this.isMilestoneTotalCorrect = totalMilestoneAmount === budgetAmount;

    // Optional: still set validation error
    if (!this.isMilestoneTotalCorrect && this.milestones.length > 0) {
      this.createErrandForm.get('budgetAmount')?.setErrors({ totalMismatch: true });
    } else {
      this.createErrandForm.get('budgetAmount')?.setErrors(null);
    }
  }

  // checkTotalBudget() {
  //   const budgetAmount = this.createErrandForm.get('budgetAmount')?.value || 0;
  //   const totalMilestoneAmount = this.milestones.value
  //     .map((m: any) => Number(m.amount) || 0)
  //     .reduce((a: number, b: number) => a + b, 0);

  //   if (budgetAmount !== totalMilestoneAmount) {
  //     this.createErrandForm
  //       .get('budgetAmount')
  //       ?.setErrors({ totalMismatch: true });
  //   } else {
  //     const errors = this.createErrandForm.get('budgetAmount')?.errors;
  //     if (errors) {
  //       delete errors['totalMismatch'];
  //       if (Object.keys(errors).length === 0) {
  //         this.createErrandForm.get('budgetAmount')?.setErrors(null);
  //       } else {
  //         this.createErrandForm.get('budgetAmount')?.setErrors(errors);
  //       }
  //     }
  //   }
  // }

  // removeMilestone(index: number): void {
  //   this.milestones.removeAt(index);
  // }

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
      address: ['', Validators.required],
    });
  }

  addLocation(): void {
    this.locations.push(this.createLocation());
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  // toggleCategory(category: string) {
  //   this.selectedCategory = category;
  // }

  toggleSelection(service: Service) {
    service.selected = !service.selected;
  }

  get selectedCount() {
    return this.services.filter((s) => s.selected).length;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    this.uploadedFiles = this.createErrandForm.get('images') as FormArray;
    Array.from(files).forEach(async (file) => {
      const base64 = await this.convertToBase64(file);
      this.uploadedFiles.push(
        this.fb.group({
          image_base64: base64,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      );
    });
  }

  removeFile(index: number) {
    this.uploadedFiles.removeAt(index);
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
    const budget = Number(this.createErrandForm.value.budgetAmount) || 0;
    this.serviceFee = budget;
    this.platformFee = budget * 0.05;
    if (this.selectedPriority === 'urgent') {
      this.urgencyFee = budget * 0.05;
    } else if (this.selectedPriority === 'emergency') {
      this.urgencyFee = budget * 0.1;
    } else {
      this.urgencyFee = 0;
    }

    this.totalAmount = budget + this.platformFee + this.urgencyFee;
  }

  toggleMilestones() {
    const useMilestones = this.createErrandForm.get('useMilestones')?.value;
    this.useMilestones = !this.useMilestones;
    if (useMilestones && this.milestones.length === 0) {
      this.addMilestone();
    } else if (!useMilestones) {
      this.milestones.clear();
    }
  }

  // toggleMilestones(): void {
  //   this.useMilestones = !this.useMilestones;
  //   this.createErrandForm.patchValue({ useMilestones: this.useMilestones });
  // }

  /** Submit form */
  onSubmit(): void {
    const selectedServiceIds = this.services
      .filter((service) => service.selected)
      .map((service) => service.id);

    this.isLoading = true;

    if (this.createErrandForm.valid) {
      const data = {
        errand_title: this.createErrandForm.value.errandTitle,
        priority: this.createErrandForm.value.priority,
        budget_type: this.createErrandForm.value.budgetType,
        business: this.business_details.user,
        budget_amount: this.createErrandForm.value.budgetAmount || 0,
        estimated_hours: this.createErrandForm.value.estimatedHours,
        use_milestones: this.createErrandForm.value.useMilestones,
        payment_method: this.createErrandForm.value.paymentMethod,
        special_instructions:
          this.createErrandForm.value.specialInstructions || '',
        contact_preference: this.createErrandForm.value.contactPreference,
        agree_terms: this.createErrandForm.value.agreeTerms,
        agree_escrow: this.createErrandForm.value.agreeEscrow,
        start_date: this.createErrandForm.value.startDate,
        stop_date: this.createErrandForm.value.stopDate,
        descriptions: this.descriptions?.value || this.descriptions,
        locations: this.locations?.value || this.locations,
        milestones: this.milestones?.value || this.milestones,
        images: this.createErrandForm.get('images')?.value || [],
        service_ids: selectedServiceIds,
      };
      console.log(data);

      // return;
      this._errandService.createNewErrand(data).subscribe((res: any) => {
        this.isLoading = false;
        console.log('Errand created successfully:', res);
        this._router.navigate(['errands']);
      });
    } else {
      this.createErrandForm.markAllAsTouched();
      this.isLoading = false;
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
