import { Component, inject, signal, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../../services/business.service';
import { ConfirmationServiceDialogService } from '../../../sharedmodule/services/confirmation-service-dialog.service';
import { UpdateServiceComponent } from '../modals/update-service/update-service.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-b-profile',
  templateUrl: './b-profile.component.html',
  styleUrl: './b-profile.component.css',
})
export class BProfileComponent {
  basicInfoForm!: FormGroup;
  serviceInfoForm!: FormGroup;
  logoPreviewUrl: string | ArrayBuffer | null = null;
  logoInitials: string = 'BN';
  businessId!: string;
  business_details: any;
  categories: any;
  logged_in_user!: any;
  private modalService = inject(NgbModal);

  // is_logged_in_user = false;
  // my_business_id: any;
  services_list: any;

  page = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);

  constructor(
    private _businessService: BusinessService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationServiceDialogService,
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
      facebook: [''],
      twitter: [''],
      linkedin: [''],
      instagram: [''],
      website: [''],
    });

    this.logged_in_user = JSON.parse(localStorage.getItem('user_id') || 'null');

    this.serviceInfoForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price_type: ['', Validators.required],
      price_from: ['', Validators.required],
      price_to: ['', Validators.required],
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
    this.getBusinessInfo();
    this.getCategories();
    this.getServices();
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
    // Example: fetch first page, 10 items per page, no search, no category filter
    this._businessService
      .getServices(this.page(), this.pageSize())
      .subscribe((res: any) => {
        this.services_list = res.results;
        // Update total items for pagination
        this.totalItems.set(res.count || res.total || 0);
        console.log('getServices', this.services_list);

        // this.categories = res;
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



  deleteService(id: string) {
    this.confirmationDialogService
      .confirm('Please confirm', 'Do you really want to delete this service?')
      .then((confirmed) => {
        if (confirmed) {
          this._businessService.deleteService(id).subscribe({
            next: (res: any) => {
              // console.log(res);
              this.toastr.success('Service deleted successfully!');
              this.getServices();
            },
            error: (err) => {
              // console.error(err);
              this.toastr.error('Failed to delete service. Please try again.');
            },
          });
        }
      })
      .catch(() => {
        console.log('User dismissed the dialog');
      });
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.getServices();
  }

  getCategories() {
    this._businessService.getCategories().subscribe((res: any) => {
      // console.log(res);
      this.categories = res;
    });
  }

  getBusinessInfo() {
    this._businessService
      .getBusinessDetail(this.businessId)
      .subscribe((res: any) => {
        this.business_details = res;
        console.log('business_details', this.business_details, res);

        if (this.business_details) {
          // ✅ Prefill form with fetched data
          this.basicInfoForm.patchValue({
            business_name: this.business_details.business_name,
            business_logo: this.business_details.business_logo,
            business_email: this.business_details.business_email,
            business_phone: this.business_details.business_phone,
            business_tagline: this.business_details.business_tagline,
            business_description: this.business_details.business_description,
            registration_number: this.business_details.registration_number,
            kra_pin: this.business_details.kra_pin,
            facebook: this.business_details.social_links.facebook,
            twitter: this.business_details.social_links.twitter,
            linkedin: this.business_details.social_links.linkedin,
            instagram: this.business_details.social_links.instagram,
            website: this.business_details.social_links.website,
          });
        }
        if (this.business_details.business_logo) {
          this.logoPreviewUrl = this.business_details.business_logo;
        }
        console.log(this.logged_in_user, this.business_details.user);

        // if (this.logged_in_user === this.business_details.user) {
        //   this.is_logged_in_user = true;
        // }
      });
  }

  addBusinessInfo() {
    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();

    // Loop through all controls and append to FormData
    Object.keys(this.basicInfoForm.controls).forEach((key) => {
      const controlValue = this.basicInfoForm.get(key)?.value;
      if (key === 'business_logo' && controlValue instanceof File) {
        formData.append(key, controlValue); // append file
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
            // this.route.navigate(['/dashboard']); // adjust route as needed
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
          // this.route.navigate(['/dashboard']); // adjust route as needed
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
      // generate preview
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
    this.logoPreviewUrl = null; // go back to initials
  }

  faqs = [
    {
      question: 'How quickly can you complete an errand?',
      answer:
        'We offer same-day service for most errands. Our typical response time is under 1 hour, and we can usually complete errands within 2-4 hours depending on the complexity and location.',
      isOpen: false,
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, debit cards, PayPal, and payments through the ErrandHub platform. For regular clients, we also offer monthly billing options.',
      isOpen: false,
    },
    {
      question: 'Are your staff background checked?',
      answer:
        'Yes, all our team members undergo thorough background checks, including criminal history and reference verification. We are also fully insured and bonded for your peace of mind.',
      isOpen: false,
    },
    {
      question: 'Can I request the same errand runner?',
      answer:
        "Absolutely! Many of our clients prefer working with the same team member. You can request your preferred errand runner when booking, and we'll do our best to accommodate based on availability.",
      isOpen: false,
    },
  ];

  showForm = false;
  showServiceForm = false;

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  toggleBasicInfoForm() {
    this.showForm = !this.showForm;
  }

  toggleServiceForm() {
    this.showServiceForm = !this.showServiceForm;
  }

  navigateBack() {
    window.history.back();
  }
}
