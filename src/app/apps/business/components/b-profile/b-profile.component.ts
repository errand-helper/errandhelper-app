import { Component, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../../services/business.service';
import { ConfirmationServiceDialogService } from '../../../sharedmodule/services/confirmation-service-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BusinessDetail,
  FrequentlyAskedQuestion,
  ServiceArea,
  ServiceAreaResult,
  ServiceResult,
} from '../../models/business.model';
import { Category } from '../../../sharedmodule/models/category';



@Component({
  selector: 'app-b-profile',
  templateUrl: './b-profile.component.html',
  styleUrl: './b-profile.component.css',
})
export class BProfileComponent implements OnInit {
  basicInfoForm!: FormGroup;
  serviceInfoForm!: FormGroup;
  frequentlyAskedQuestionsForm!: FormGroup;

  logoPreviewUrl: string | ArrayBuffer | null = null;
  logoInitials: string = 'BN';
  businessId!: string;
  business_details: BusinessDetail | null = null;
  categories: Category[] = [];
  private modalService = inject(NgbModal);

  area: string = '';
  physicalAddress: string = '';
  radius: number | null = null;

  serviceAreas: ServiceArea[] = [];
  editIndex: number | null = null;
  service_areas: ServiceArea[] = [];
  services_list: any;

  page = signal(1);
  pageSize = signal(10);
  totalServiceItems = signal(0);
  totalServiceAreaItems = signal(0);
  faqs: FrequentlyAskedQuestion[] = [];

  showForm = false;
  showServiceForm = false;
  showServiceAreaForm = false;
  showFrequentlyAskedQuestionsForm = false;
  showAvailabilityForm = false;

  selectedStatus: 'available' | 'unavailable' | null = null;
  showFeedback = false;
  showPulse = false;
  isSaving = false;
  savedStatus = false;
  editMode = true;

  constructor(
    private _businessService: BusinessService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationServiceDialogService
  ) {}

  ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('id')!;
    this.basicInfoForm = this.fb.group({
      business_name: ['', Validators.required],
      business_logo: [''],
      business_email: ['', Validators.required],
      business_phone: ['', Validators.required],
      business_tagline: [''],
      business_description: ['', Validators.required],
      registration_number: ['', Validators.required],
      kra_pin: ['', Validators.required],
      facebook: ['',Validators.pattern(/https?:\/\/.+/)],
      twitter: ['',Validators.pattern(/https?:\/\/.+/)],
      linkedin: ['',Validators.pattern(/https?:\/\/.+/)],
      instagram: ['',Validators.pattern(/https?:\/\/.+/)],
      website: ['',Validators.pattern(/https?:\/\/.+/)],
    });


    this.serviceInfoForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price_type: ['', Validators.required],
      price_from: ['', Validators.required],
      price_to: ['', Validators.required],
    });

    this.frequentlyAskedQuestionsForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });

    this.basicInfoForm
      .get('business_name')
      ?.valueChanges.subscribe((name: string) => {
        if (name) {
          const words = name.trim().split(' ');
          if (words.length === 1) {
            this.logoInitials = words[0].substring(0, 2).toUpperCase();
          } else {
            this.logoInitials = (words[0][0] + words[1][0]).toUpperCase();
          }
        } else {
          this.logoInitials = 'BN';
        }
      });

    setTimeout(() => {
      this.showFeedback = true;
    }, 500);


    this.getBusinessInfo();
    this.getCategories();
    this.getServices();

    this.getServiceAreas();
  }

  addService() {
    this._businessService.addService(this.serviceInfoForm.value).subscribe(
      (res: any) => {
        this.toastr.success('Service added successfully');
        this.serviceInfoForm.reset();
        this.getServices();
      },
      (err) => {
        this.toastr.error('Failed to add Service.');
      }
    );
  }

  getServices() {
    this._businessService
      .getServices(this.page(), this.pageSize())
      .subscribe((res: ServiceResult) => {
        this.services_list = res.results;
        this.totalServiceItems.set(res.count || 0);
      });
  }

  onServiceUpdated() {
    this.getServices();
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          console.log(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
  }

  // Add new service area or update if editing
  addServiceArea() {
    if (this.editIndex !== null) {
      this.serviceAreas[this.editIndex] = {
        area_name: this.area,
        physical_address: this.physicalAddress,
        service_radius: this.radius,
        latitude: '',
        longitude: '',
      };
      this.editIndex = null;
    } else {
      this.serviceAreas.push({
        area_name: this.area,
        physical_address: this.physicalAddress,
        service_radius: this.radius,
        latitude: '',
        longitude: '',
      });
    }

    this.resetFields();
  }

  // Edit a service area
  editServiceArea(index: number) {
    const service = this.serviceAreas[index];
    this.area = 'service.area to update';
    this.physicalAddress = service.physical_address;
    this.radius = service.service_radius;
    this.editIndex = index;
  }

  // Remove a service area
  removeServiceArea(index: number) {
    this.serviceAreas.splice(index, 1);
  }

  submitServiceArea() {
    this._businessService.addServiceArea(this.serviceAreas).subscribe(
      (res: any) => {
        this.toastr.success(res.message);
        this.serviceAreas = [];
        this.showServiceAreaForm = false;
      },
      (err) => this.toastr.error('An error occurred')
    );
  }

  // Reset input fields
  resetFields() {
    this.area = '';
    this.physicalAddress = '';
    this.radius = null;
  }

  deleteService(id: string) {
    this.confirmationDialogService
      .confirm('Please confirm', 'Do you really want to delete this service?')
      .then((confirmed) => {
        if (confirmed) {
          this._businessService.deleteService(id).subscribe({
            next: (res: any) => {
              this.toastr.success('Service deleted successfully!');
              this.getServices();
            },
            error: (err) => {
              this.toastr.error('Failed to delete service. Please try again.');
            },
          });
        }
      })
      .catch(() => {
        console.log('User dismissed the dialog');
      });
  }

  onServiceListPageChange(newPage: number) {
    this.page.set(newPage);
    this.getServices();
  }

  onServiceAreaPageChange(newPage: number) {
    this.page.set(newPage);
    this.getServiceAreas();
  }

  getServiceAreas() {
    this._businessService
      .getServiceAreas(this.page(), this.pageSize())
      .subscribe((res: ServiceAreaResult) => {
        console.log('res', res);
        this.service_areas = res.results;
        this.totalServiceAreaItems.set(res.count || 0);
      });
  }

  getCategories() {
    this._businessService.getCategories().subscribe((res: Category) => {
      this.categories = Array.isArray(res) ? res : [res];
    });
  }


  addFAQ() {
    this._businessService
      .addFAQS(this.frequentlyAskedQuestionsForm.value)
      .subscribe(
        (res: FrequentlyAskedQuestion) => {
          this.toastr.success('Question added successfully');
          this.showFrequentlyAskedQuestionsForm = false;
          // this.getFAQS();
        },
        (err) => {
          console.log(err);
          this.toastr.error('An error occurred');
        }
      );
  }

  getBusinessInfo() {
    this._businessService
      .getBusinessDetail(this.businessId)
      .subscribe((res: BusinessDetail) => {
        this.business_details = res;
        this.faqs = this.business_details.frequently_asked_question || [];

        if (this.business_details) {
          this.basicInfoForm.patchValue({
            business_name: this.business_details.business_name,
            business_logo: this.business_details.business_logo,
            business_email: this.business_details.business_email,
            business_phone: this.business_details.business_phone,
            business_tagline: this.business_details.business_tagline,
            business_description: this.business_details.business_description,
            registration_number: this.business_details.registration_number,
            kra_pin: this.business_details.kra_pin,
            facebook: this.business_details.social_links?.facebook,
            twitter: this.business_details.social_links?.twitter,
            linkedin: this.business_details.social_links?.linkedin,
            instagram: this.business_details.social_links?.instagram,
            website: this.business_details.social_links?.website,
          });
        }
        if (this.business_details.business_logo) {
          this.logoPreviewUrl = this.business_details.business_logo;
        }
      });
  }

  addBusinessInfo() {
    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();

    Object.keys(this.basicInfoForm.controls).forEach((key) => {
      const controlValue = this.basicInfoForm.get(key)?.value;
      if (key === 'business_logo' && controlValue instanceof File) {
        formData.append(key, controlValue);
      } else {
        formData.append(key, controlValue);
      }
    });

    const method = this.business_details ? 'updateBusinessInfo' : 'addBusiness';

    if (method === 'updateBusinessInfo') {
      this._businessService
        .updateBusinessInfo(formData, this.businessId)
        .subscribe({
          next: (res) => {
            this.toastr.success('Business information updated successfully!');
            this.getBusinessInfo()
          },
          error: (err) => {
            this.toastr.error('Failed to update business information.');
            console.error(err);
          },
        });
    } else {
      this._businessService.addBusiness(formData).subscribe({
        next: (res) => {
          this.toastr.success('Business information added successfully!');
          this.getBusinessInfo()
        },
        error: (err) => {
          this.toastr.error('Failed to add business information.');
          console.error(err);
        },
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.basicInfoForm.patchValue({ business_logo: file });
      this.basicInfoForm.get('business_logo')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.basicInfoForm.patchValue({ business_logo: null });
    this.basicInfoForm.get('business_logo')?.updateValueAndValidity();
    this.logoPreviewUrl = null;
  }

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  toggleBasicInfoForm() {
    this.showForm = !this.showForm;
  }

  toggleServiceForm() {
    this.showServiceForm = !this.showServiceForm;
  }

  toggleFrequentlyAskedQuestionsForm() {
    this.showFrequentlyAskedQuestionsForm =
      !this.showFrequentlyAskedQuestionsForm;
  }

  toggleServiceAreaForm() {
    this.showServiceAreaForm = !this.showServiceAreaForm;
  }

  navigateBack() {
    window.history.back();
  }


  selectOption(status: 'available' | 'unavailable'): void {
    this.selectedStatus = status;
    this.showPulse = true;
    this.savedStatus = false;
  }

  saveAvailability(): void {
    if (!this.selectedStatus) {
      alert('Please select an availability status first');
      return;
    }
    const isAvailable = this.selectedStatus === 'available';
    this.isSaving = true;
    const data = {
      "available":isAvailable
    }

    this.savedStatus = true
    this._businessService.updateAvailability(data).subscribe((res:any)=>{
      this.getBusinessInfo()

    })

  }


}


