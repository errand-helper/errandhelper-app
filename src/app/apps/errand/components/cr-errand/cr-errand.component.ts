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
import { ToastrService } from 'ngx-toastr';

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
      icon: 'fas fa-credit-card',
      color: 'var(--primary-blue)',
    },
    {
      id: 'mpesa',
      label: 'M-pesa',
      // detail: 'johnexample.com',
      icon: 'fa fa-phone',
      color: '#0070ba',
    },
    {
      id: 'platform',
      label: 'Platform',
      // detail: '•••• 5678',
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

  isLoading: boolean = false;
  errandId!: string;
  // errand: any;

  isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly _businessService: BusinessService,
    private readonly route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _errandService: ErrandService,
    private readonly _toastr: ToastrService
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

    this.createForm();

    const errandId = this.route.snapshot.paramMap.get('errand_id');

    if (errandId) {
      this.isEditMode = true;
      this.errandId = errandId;
      this.getErrandInfo();
    }
    // else {
    this.getBusinessInfo();
    // }

    this.createErrandForm.valueChanges.subscribe(() => {
      this.updateCostSummary();
    });

    this.milestones.valueChanges.subscribe(() => this.checkTotalBudget());
    this.createErrandForm.get('budgetAmount')?.valueChanges.subscribe(() => {
      this.checkTotalBudget();
    });
  }

  createForm() {
    this.createErrandForm = this.fb.group({
      errandTitle: ['', Validators.required],
      descriptions: this.fb.array([]),
      locations: this.fb.array([], {
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
  }

  // ngOnInit(): void {
  //   this.businessId = this.route.snapshot.paramMap.get('business_id')!;
  //   console.log('Business ID:', this.businessId);

  //   if(this.route.snapshot.paramMap.get('errand_id')){
  //     this.errandId = this.route.snapshot.paramMap.get('errand_id')!;
  //     this.getErrandInfo()
  //   }else{
  //   this.getBusinessInfo();

  //   }

  //   this.createErrandForm = this.fb.group({
  //     errandTitle: ['', Validators.required],
  //     descriptions: this.fb.array([]),
  //     locations: this.fb.array([this.createLocation()], {
  //       validators: [this.validateLocations()],
  //     }),
  //     priority: ['normal', Validators.required],
  //     budgetType: ['fixed', Validators.required],
  //     budgetAmount: [null],
  //     estimatedHours: [null],
  //     milestones: this.fb.array([]),
  //     useMilestones: [false],
  //     paymentMethod: ['', Validators.required],
  //     specialInstructions: [''],
  //     contactPreference: ['platform'],
  //     agreeTerms: [false, Validators.requiredTrue],
  //     agreeEscrow: [false, Validators.requiredTrue],
  //     startDate: ['', Validators.required],
  //     stopDate: ['', Validators.required],
  //     images: this.fb.array([]),
  //   });

  //   this.createErrandForm.valueChanges.subscribe(() => {
  //     this.updateCostSummary();
  //   });
  //   this.milestones.valueChanges.subscribe(() => this.checkTotalBudget());
  //   this.createErrandForm.get('budgetAmount')?.valueChanges.subscribe(() => this.checkTotalBudget());
  // }

  getBusinessInfo() {
    this._businessService
      .getBusinessLiteDetail(this.businessId)
      .subscribe((res: any) => {
        this.business_details = res;
        this.services = this.business_details?.services || [];
        console.log(this.services);
      });
  }

  getErrandInfo() {
    this.isLoading = true;
    this._errandService.getErrandDetails(this.errandId).subscribe({
      next: (res) => {
        this.populateForm(res);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  populateForm(errand: any) {
    this.createErrandForm.patchValue({
      errandTitle: errand.errand_title,
      priority: errand.priority,
      budgetType: errand.budget_type,
      budgetAmount: errand.budget_amount,
      estimatedHours: errand.estimated_hours,
      paymentMethod: errand.payment_method,
      specialInstructions: errand.special_instructions,
      contactPreference: errand.contact_preference,
      startDate: errand.start_date,
      stopDate: errand.stop_date,
      useMilestones: errand.use_milestones,
      agreeTerms: true,
      agreeEscrow: true,
    });

    this.selectedPriority = errand.priority;
    this.selectedBudgetType = errand.budget_type;
    this.selectedPayment = errand.payment_method;

    this.populateDescriptions(errand.descriptions);
    this.populateLocations(errand.locations);
    this.populateMilestones(errand.milestones);
    this.populateServices(errand.services);
  }

  populateDescriptions(descriptions: string[]) {
    const control = this.descriptions;
    control.clear();

    descriptions.forEach((desc) => {
      control.push(this.fb.control(desc, Validators.required));
    });
  }

  populateLocations(locations: any[]) {
    const control = this.locations;
    control.clear();

    locations.forEach((loc) => {
      control.push(
        this.fb.group({
          city: [loc.city, Validators.required],
          town: [loc.town, Validators.required],
          address: [loc.address, Validators.required],
        })
      );
    });
  }

  populateMilestones(milestones: any[]) {
    if (!milestones || milestones.length === 0) return;

    this.useMilestones = true;

    const control = this.milestones;
    control.clear();

    milestones.forEach((m) => {
      control.push(
        this.fb.group({
          description: [m.description, Validators.required],
          amount: [m.amount, Validators.required],
        })
      );
    });
  }

  populateServices(services: any[]) {
    this.services.forEach((service) => {
      service.selected = services.some((s: any) => s.id === service.id);
    });
  }

  get filteredServices() {
    const term = this.searchTerm.toLowerCase();

    return this.services.filter((service) => {
      return (
        (this.selectedCategory === 'All Services' ||
          service.category === this.selectedCategory) &&
        service.name.toLowerCase().includes(term)
      );
    });
  }

  // get filteredServices() {
  //   return this.services.filter((service) => {
  //     const matchesCategory =
  //       this.selectedCategory === 'All Services' ||
  //       service.category === this.selectedCategory;
  //     const matchesSearch = service.name
  //       .toLowerCase()
  //       .includes(this.searchTerm.toLowerCase());
  //     return matchesCategory && matchesSearch;
  //   });
  // }

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

  removeMilestone(index: number) {
    this.milestones.removeAt(index);
    this.checkTotalBudget();
  }

  checkTotalBudget() {
    const budgetAmount = Number(
      this.createErrandForm.get('budgetAmount')?.value || 0
    );
    const totalMilestoneAmount = this.milestones.value
      .map((m: any) => Number(m.amount) || 0)
      .reduce((a: number, b: number) => a + b, 0);

    //  Update flag
    this.isMilestoneTotalCorrect = totalMilestoneAmount === budgetAmount;

    // Optional: still set validation error
    if (!this.isMilestoneTotalCorrect && this.milestones.length > 0) {
      this.createErrandForm
        .get('budgetAmount')
        ?.setErrors({ totalMismatch: true });
    } else {
      this.createErrandForm.get('budgetAmount')?.setErrors(null);
    }
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
      address: ['', Validators.required],
    });
  }

  addLocation(): void {
    this.locations.push(this.createLocation());
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  toggleSelection(service: Service) {
    service.selected = !service.selected;
  }

  get selectedCount(): number {
    return this.services.reduce((count, s) => count + (s.selected ? 1 : 0), 0);
  }

  // get selectedCount() {
  //   return this.services.filter((s) => s.selected).length;
  // }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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

  /** Submit form */
  onSubmit() {
    if (this.createErrandForm.invalid) return;

    const selectedServiceIds = this.services
      .filter((service) => service.selected)
      .map((service) => service.id);

    const payload = {
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

    console.log(payload);


    if (this.isEditMode) {
      this._errandService
        .updateErrand(this.errandId, payload)
        .subscribe((res: any) => {
          this._toastr.success('Errand updated successfully!');
          this._router.navigate(['errands', res.id]);
        });

    } else {
      this._errandService.createNewErrand(payload).subscribe((res:any) => {
        this._toastr.success('Errand created successfully!');
        this._router.navigate(['errands', res.id]);
      });
    }
  }

  // onSubmit(): void {
  //   const selectedServiceIds = this.services
  //     .filter((service) => service.selected)
  //     .map((service) => service.id);

  //   this.isLoading = true;

  //   if (this.createErrandForm.valid) {
  //     const data = {
  //       errand_title: this.createErrandForm.value.errandTitle,
  //       priority: this.createErrandForm.value.priority,
  //       budget_type: this.createErrandForm.value.budgetType,
  //       business: this.business_details.user,
  //       budget_amount: this.createErrandForm.value.budgetAmount || 0,
  //       estimated_hours: this.createErrandForm.value.estimatedHours,
  //       use_milestones: this.createErrandForm.value.useMilestones,
  //       payment_method: this.createErrandForm.value.paymentMethod,
  //       special_instructions:
  //         this.createErrandForm.value.specialInstructions || '',
  //       contact_preference: this.createErrandForm.value.contactPreference,
  //       agree_terms: this.createErrandForm.value.agreeTerms,
  //       agree_escrow: this.createErrandForm.value.agreeEscrow,
  //       start_date: this.createErrandForm.value.startDate,
  //       stop_date: this.createErrandForm.value.stopDate,
  //       descriptions: this.descriptions?.value || this.descriptions,
  //       locations: this.locations?.value || this.locations,
  //       milestones: this.milestones?.value || this.milestones,
  //       images: this.createErrandForm.get('images')?.value || [],
  //       service_ids: selectedServiceIds,
  //     };
  //     console.log(data);

  //     // return;
  //     this._errandService.createNewErrand(data).subscribe(
  //       (res: any) => {
  //         this.isLoading = false;
  //         console.log('Errand created successfully:', res);
  //         this._router.navigate(['errands', res.id]);
  //         this._toastr.success('Errand created successfully!');
  //       },
  //       (error: any) => {
  //         this.isLoading = false;
  //         this._toastr.error(
  //           error?.error?.error || 'Failed to create errand. Please try again.'
  //         );
  //       }
  //     );
  //   } else {
  //     this.createErrandForm.markAllAsTouched();
  //     this.isLoading = false;
  //     this._toastr.success('Errand created successfully!');
  //   }
  // }

  saveDraft(): void {
    console.log('Draft saved:', this.createErrandForm.value);
    alert('Draft saved successfully!');
  }

  navigateBack() {
    window.history.back();
  }

  clearForm() {
    this.createErrandForm.reset();
  }
}
